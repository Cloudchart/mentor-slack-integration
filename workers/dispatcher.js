import momentTimezone from 'moment-timezone'
import { WebClient } from 'slack-client'
import { errorMarker, noticeMarker } from '../lib'
import { enqueue, getRandomUnratedInsight, getRandomSubscribedTopic } from './helpers'
import { Channel, Team, TimeSetting } from '../models'

const workerName = 'dispatcher'


// helpers
//
function isEveryoneAsleep(channel) {
  return new Promise((resolve, reject) => {
    const SlackWeb = new WebClient(channel.Team.accessToken)
    SlackWeb.channels.info(channel.id, (err, res) => {
      if (err = err || res.error) {
        if (err === 'account_inactive') channel.Team.update({ isActive: false })
        console.log(errorMarker, err, workerName, 'channels.info')
        resolve(null)
      } else {
        if (!channel.Team.isActive) channel.Team.update({ isActive: true })
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
    try {
      const response = await getRandomUnratedInsight(channel.id)
      if (response) {
        const { insight, topic } = response
        await enqueue('insightsDispatcher', [channel, insight, topic])
        resolve(true)
      } else {
        console.log(noticeMarker, workerName, "couldn't find unrated insight for channel:", channel.id)
        resolve(null)
      }
    } catch (err) {
      console.log(errorMarker, workerName, 'sendInsight', err)
      resolve(false)
    }
  })
}

// request random link and insights for selected topics
// enqueue linksDispatcher
function sendLink(channel) {
  return new Promise(async (resolve, reject) => {
    try {
      const topic = await getRandomSubscribedTopic(channel.id)
      if (topic) {
        await enqueue('linksDispatcher', [channel, topic])
        resolve(true)
      } else {
        await sendInsight(channel)
        console.log(noticeMarker, workerName, "couldn't find random link for channel:", channel.id)
        resolve(null)
      }
    } catch (err) {
      console.log(errorMarker, workerName, 'sendLink', err)
      resolve(false)
    }
  })
}

// for each selected channel
// check team time settings
// check if everyone is away
// send insight or link
function perform(done) {
  Channel.findAll({ include: [{ model: Team, include: [TimeSetting] }] }).then(channels => {
    const jobs = channels.reduce(async (promiseChain, channel) => {
      return promiseChain.then(async () => {
        const timeSetting = channel.Team.TimeSetting
        const now = momentTimezone().tz(timeSetting.tz)
        const day = now.format('ddd')
        const time = now.format('HH:mm')
        const hour = now.format('HH')
        if (!timeSetting.days.includes(day)) return

        const everyoneIsAsleep = await isEveryoneAsleep(channel)
        if (everyoneIsAsleep || everyoneIsAsleep === null) return

        if (hour === timeSetting.startTime.split(':')[0]) {
          await sendLink(channel)
        } else if (time > timeSetting.startTime && time <= timeSetting.endTime) {
          await sendInsight(channel)
        }
      })
    }, Promise.resolve())

    jobs.then(() => done(null, true))
  }).catch(err => {
    console.log(errorMarker, workerName, err);
    done(false)
  })

}


export { perform }
