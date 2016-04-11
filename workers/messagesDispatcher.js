import moment from 'moment'
import { WebClient } from 'slack-client'

import {
  eventMarker,
  errorMarker,
  reactionsCollectorDelay,
  notInChannelNotifierDelay,
} from '../lib'

import { markInsightAsRead } from './helpers'
import { Message } from '../models'
import { queue } from '../initializers/node_resque'

const workerName = 'messagesDispatcher'


// helpers
//
function enqueueNotInChannelNotifier(channelId, done) {
  queue.scheduledAt('slack-integration', 'notInChannelNotifier', channelId, async (err, timestamps) => {
    // don't enqueue if already enqueued
    if (timestamps.length > 0) {
      done(null, true)
    } else {
      queue.enqueueIn(notInChannelNotifierDelay, 'slack-integration', 'notInChannelNotifier', channelId, () => {
        console.log(eventMarker, 'enqueued notInChannelNotifier')
        done(null, true)
      })
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

      queue.enqueueIn(reactionsCollectorDelay, 'slack-integration', 'reactionsCollector', [
        message.id, insight.id, topic.id
        ], () => {
        console.log(eventMarker, 'enqueued reactionsCollector')
        done(null, true)
      })
    }
  })
}


export { perform }
