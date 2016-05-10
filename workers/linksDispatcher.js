import { WebClient } from 'slack-client'

import { errorMarker, noticeMarker } from '../lib'
import { enqueue, enqueueIn, markLinkAsRead } from './helpers'

const workerName = 'linksDispatcher'


// get text
// post message
// if message sent, send random insights and mark as read
// TODO: save output
function perform(channel, topic, done) {
  const SlackWeb = new WebClient(channel.Team.accessToken)
  const link = topic.randomLink
  const linkRegex = new RegExp(/#link#/g)
  let text

  if (linkRegex.test(link.reaction.content)) {
    text = link.reaction.content.replace(linkRegex, `<${link.url}|${link.title}>`)
  } else {
    text = `${link.reaction.content} <${link.url}|${link.title}>`
  }

  const options = {
    as_user: true,
    unfurl_links: false,
    unfurl_media: false,
  }

  SlackWeb.chat.postMessage(channel.id, text, options, async (err, res) => {
    if (err = err || res.error) {
      console.log(errorMarker, err, workerName, 'chat.postMessage')
      done(null)
    } else {
      topic.randomInsights.forEach(insight => {
        enqueue('insightsDispatcher', [channel, insight, topic])
      })

      if (channel.shouldSendMessagesAtOnce) {
        await enqueueIn(5000, 'insightsDailyDispatcher', channel)
      }

      await markLinkAsRead(channel.id, link.id)
      done(null, true)
    }
  })
}


export { perform }
