import moment from 'moment'
import { WebClient } from 'slack-client'
import { clean } from 'underscore.string'
import { queue } from '../node-resque'
import { enqueueIn, markInsightAsRead } from './helpers'
import { errorMarker, notInChannelNotifierDelay } from '../lib'
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
// if message sent, mark as read and save output
function perform(channel, insight, topic, done) {
  const SlackWeb = new WebClient(channel.Team.accessToken)
  const { url, author, title, duration } = insight.origin
  const content = clean(insight.content)

  let urlTitle = author
  if (title) urlTitle += `, ${title}`
  if (duration > 0) urlTitle += ` (${moment.duration(duration, 'seconds').humanize()} read)`

  const attachments = [{
    fallback: content,
    text: `${content} _<${url}|${urlTitle}>_`,
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
        topicId: topic.id,
        insightId: insight.id,
      })

      done(null, true)
    }
  })
}


export { perform }
