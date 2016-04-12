import moment from 'moment'
import { WebClient } from 'slack-client'

import { errorMarker, reactionsCollectorDelay, notInChannelNotifierDelay } from '../lib'
import { queue, enqueueIn, markInsightAsRead } from './helpers'
import { Message } from '../models'

const workerName = 'insightsDispatcher'


// helpers
//
function enqueueNotInChannelNotifier(channelId, done) {
  queue.scheduledAt('slack-integration', 'notInChannelNotifier', channelId, async (err, timestamps) => {
    // don't enqueue if already enqueued
    if (timestamps.length > 0) {
      done(null, true)
    } else {
      await enqueueIn(notInChannelNotifierDelay, 'notInChannelNotifier', channelId)
      done(null, true)
    }
  })
}

// get text
// post message
// if bot isn't invited, enqueue notInChannelNotifier
// if message sent, mark as read, save output and enqueue reactionsCollector
function perform(channel, insight, topic, done) {
  const SlackWeb = new WebClient(channel.Team.accessToken)
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

  SlackWeb.chat.postMessage(channel.id, null, options, async (err, res) => {
    if (err = err || res.error) {
      if (err === 'not_in_channel') {
        enqueueNotInChannelNotifier(channel.id, done)
      } else {
        console.log(errorMarker, err, workerName, 'chat.postMessage')
        done(null, true)
      }
    } else {
      await markInsightAsRead(channel.id, topic.id, insight.id)

      const message = await Message.create({
        channelId: res.channel,
        timestamp: res.ts,
        responseBody: JSON.stringify(res),
      })

      await enqueueIn(reactionsCollectorDelay, 'reactionsCollector', [message.id, insight.id, topic.id])
      done(null, true)
    }
  })
}


export { perform }
