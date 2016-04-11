import momentTimezone from 'moment-timezone'

import { WebClient } from 'slack-client'
import { queue } from '../initializers/node_resque'
import { errorMarker } from '../lib'
import { Channel, Team, TimeSetting } from '../models'

import {
  checkIfBotIsInvited,
  getRandomSubscribedTopic,
  markLinkAsRead,
} from './helpers'

const workerName = 'linksDispatcher'


// helpers
//
function itSatisfiesTimeSetting(channel) {
  const timeSetting = channel.Team.TimeSetting
  const now = momentTimezone().tz(timeSetting.tz)
  const time = now.format('HH:mm')
  return time === timeSetting.startTime
 }

function sendInsights(channel, topic) {
  topic.randomInsights.forEach(insight => {
    queue.enqueue('slack-integration', 'messagesDispatcher', [channel, insight, topic], () => {
      console.log(eventMarker, 'enqueued messagesDispatcher')
    })
  })
}

function sendLink(channel, topic, SlackWeb) {
  return new Promise((resolve, reject) => {
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
        reject()
      } else {
        await markLinkAsRead(channel.id, link.id)
        sendInsights(channel, topic)
        resolve()
      }
    })
  })

}

// for each selected channel
// on start time of team time settings
// request links and insights for selected topics
// check if bot is invited to channel
// select random link and 3 random insights
// post messages to channel
// mark topic link as read
async function perform(done) {
  const channels = await Channel.findAll({ include: [{ model: Team, include: [TimeSetting] }] })

  const jobs = channels.reduce(async (promiseChain, channel) => {
    return promiseChain.then(async () => {
      if (!itSatisfiesTimeSetting(channel)) return
      const SlackWeb = new WebClient(channel.Team.accessToken)
      const isBotInvited = await checkIfBotIsInvited(channel.id, SlackWeb)
      if (!isBotInvited) return

      const topic = await getRandomSubscribedTopic(channel.id)
      if (topic) await sendLink(channel, topic, SlackWeb)
    })
  }, Promise.resolve())

  jobs.then(() => done(null, true))
}


export { perform }
