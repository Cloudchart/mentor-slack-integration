import momentTimezone from 'moment-timezone'
import { WebClient } from 'slack-client'
import { queue } from '../initializers/node_resque'
import { eventMarker, errorMarker, noticeMarker } from '../lib'
import { getRandomUnratedInsight, getRandomSubscribedTopic, markLinkAsRead } from './helpers'
import { Channel, Team, TimeSetting } from '../models'

const workerName = 'dispatcher'


// helpers
//
function isEveryoneAsleep(channelId, SlackWeb) {
  return new Promise((resolve, reject) => {
    SlackWeb.channels.info(channelId, (err, res) => {
      if (err = err || res.error) {
        console.log(errorMarker, err, workerName, 'channels.info')
        resolve(null)
      } else {
        let members = res.channel.members

        SlackWeb.users.list(1, (err, res) => {
          if (err = err || res.error) {
            console.log(errorMarker, err, workerName, 'users.list')
            resolve(null)
          } else {
            let activeUsers = res.members.filter(member => {
              return (
                members.includes(member.id) &&
                !member.deleted &&
                !member.is_ultra_restricted &&
                !member.is_bot &&
                member.presence === 'active'
              )
            })

            resolve(activeUsers.length === 0)
          }
        })
      }
    })
  })
}

// request unrated insight
// enqueue insightsDispatcher
function sendInsight(channel) {
  return new Promise(async (resolve, reject) => {
    const response = await getRandomUnratedInsight(channel.id)
    if (response) {
      const { insight, topic } = response
      queue.enqueue('slack-integration', 'insightsDispatcher', [channel, insight, topic], () => {
        console.log(eventMarker, 'enqueued insightsDispatcher')
        resolve(true)
      })
    } else {
      console.log(noticeMarker, `couldn't find unrated insight for channel: ${channel.id}`)
      resolve(null)
    }
  })
}

// request random link and insights for selected topics
// post link and mark it as read
// send insights
function sendLink(channel, SlackWeb) {
  return new Promise(async (resolve, reject) => {
    const topic = await getRandomSubscribedTopic(channel.id)
    if (!topic) {
      await sendInsight(channel)
      return resolve(null)
    }

    const link = topic.randomLink
    const text = `${link.reaction.content} <${link.url}|${link.title}>`

    const options = {
      as_user: true,
      unfurl_links: false,
      unfurl_media: false,
    }

    SlackWeb.chat.postMessage(channel.id, text, options, async (err, res) => {
      if (err = err || res.error) {
        console.log(errorMarker, err, workerName, 'chat.postMessage')
        resolve(null)
      } else {
        await markLinkAsRead(channel.id, link.id)

        topic.randomInsights.forEach(insight => {
          queue.enqueue('slack-integration', 'insightsDispatcher', [channel, insight, topic], () => {
            console.log(eventMarker, 'enqueued insightsDispatcher')
          })
        })

        resolve(true)
      }
    })
  })

}

// for each selected channel
// check team time settings
// check if everyone is away
// send insight or link
async function perform(done) {
  const channels = await Channel.findAll({ include: [{ model: Team, include: [TimeSetting] }] })

  const jobs = channels.reduce(async (promiseChain, channel) => {
    return promiseChain.then(async () => {
      const timeSetting = channel.Team.TimeSetting
      const now = momentTimezone().tz(timeSetting.tz)
      const day = now.format('ddd')
      const time = now.format('HH:mm')
      if (!timeSetting.days.includes(day)) return

      const SlackWeb = new WebClient(channel.Team.accessToken)

      const everyoneIsAsleep = await isEveryoneAsleep(channel.id, SlackWeb)
      if (everyoneIsAsleep || everyoneIsAsleep === null) return

      if (time > timeSetting.startTime && time <= timeSetting.endTime) {
        await sendInsight(channel)
      } else if (time === timeSetting.startTime) {
        await sendLink(channel, SlackWeb)
      }
    })
  }, Promise.resolve())

  jobs.then(() => done(null, true))
}


export { perform }