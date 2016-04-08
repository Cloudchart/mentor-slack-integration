import moment from 'moment'
import momentTimezone from 'moment-timezone'

import { WebClient } from 'slack-client'
import { errorMarker, reactionsCollectorDelay } from '../lib'
import { callWebAppGraphQL } from '../routes/helpers'
import { Channel, Team, TimeSetting, Message } from '../models'

import {
  checkIfBotIsInvited,
  getRandomSubscribedTopic,
  markLinkAsRead,
  markInsightAsRead,
} from './helpers'

const workerName = 'linksDispatcher'


// helpers
//
function sendInsights(channelId, topic, SlackWeb) {
  topic.randomInsights.forEach(insight => {
    const duration = moment.duration(insight.origin.duration, 'seconds').humanize()
    const attachments = [{
      text: `${insight.content} _<${insight.origin.url}|${insight.origin.author}, ${insight.origin.title} (${duration} read)>_`,
      mrkdwn_in: ['text'],
    }]

    const options = {
      as_user: true,
      unfurl_links: false,
      unfurl_media: false,
      attachments: JSON.stringify(attachments),
    }

    SlackWeb.chat.postMessage(channelId, null, options, async (err, res) => {
      if (err = err || res.error) {
        console.log(errorMarker, err, workerName, 'chat.postMessage')
      } else {
        // const response = await markInsightAsRead(channelId, topic.id, insight.id)

        const message = await Message.create({
          channelId: res.channel,
          timestamp: res.ts,
          responseBody: JSON.stringify(res),
        })

        // TODO: enqueue reactionsCollector
      }
    })
  })
}

function sendLink(channelId, topic, SlackWeb) {
  const link = topic.randomLink
  const text = `${link.reaction.content} <${link.url}|${link.title}>`

  const options = {
    as_user: true,
    unfurl_links: false,
    unfurl_media: false,
  }

  SlackWeb.chat.postMessage(channelId, text, options, async (err, res) => {
    if (err = err || res.error) {
      console.log(errorMarker, err, workerName, 'chat.postMessage')
    } else {
      await markLinkAsRead(channelId, link.id)
      sendInsights(channelId, topic, SlackWeb)
    }
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
      const timeSetting = channel.Team.TimeSetting
      const now = momentTimezone().tz(timeSetting.tz)
      const time = now.format('HH:mm')
      // TODO: uncomment
      // if (time !== timeSetting.startTime) return

      const SlackWeb = new WebClient(channel.Team.accessToken)
      const isBotInvited = await checkIfBotIsInvited(channel.id, SlackWeb)
      if (!isBotInvited) return

      const topic = await getRandomSubscribedTopic(channel.id)
      if (topic) sendLink(channel.id, topic, SlackWeb)
    })
  }, Promise.resolve())

  jobs.then(() => done(null, true))
}


export { perform }
