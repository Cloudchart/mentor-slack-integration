import { WebClient } from 'slack-client'
import { toSentence } from 'underscore.string'

import { appName, errorMarker } from '../lib'
import { getSubscribedThemes } from './helpers'
import { Channel, ChannelNotification, Team } from '../models'

const workerName = 'channelThemesChangeNotifier'
const notificationType = 'themes_changed'


// helpers
//
async function sendMessage(channel, themes, done) {
  const channelNotification = await ChannelNotification.find({
    where: { channelId: channel.id, type: notificationType }
  })

  const SlackWeb = new WebClient(channel.Team.accessToken)
  let text

  if (channelNotification) {
    text = `New settings accepted. I will now give you advice on ${toSentence(themes)} in this channel.`
  } else {
    const pt1 = `Greetings, humans. I am ${appName}, here to give you advice on ${toSentence(themes)} in this channel. You can always change that in my settings.`
    const pt2 = "Please use reactions on my advice so I can adjust my setup and serve you better. Now let the mentoring begin!"
    text = [pt1, pt2].join('\n')
  }

  SlackWeb.chat.postMessage(channel.id, text, { as_user: true }, async (err, res) => {
    if (err = err || res.error) {
      console.log(errorMarker, err, workerName, 'chat.postMessage')
      done(null)
    } else {
      // leave trace of notification
      await ChannelNotification.create({
        channelId: channel.id,
        type: notificationType
      })

      done(null, true)
    }
  })
}

// notify channel if themes were changed
//
async function perform(channelId, done) {
  const channel = await Channel.findOne({ include: [Team], where: { id: channelId } })
  if (!channel) return done(null)

  const themes = await getSubscribedThemes(channel.id)
  if (themes.length === 0) return done(null)

  sendMessage(channel, themes, done)
}


export { perform }
