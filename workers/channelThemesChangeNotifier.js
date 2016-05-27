import { WebClient } from 'slack-client'
import { toSentence } from 'underscore.string'

import { appName, errorMarker } from '../lib'
import { getSubscribedThemes } from './helpers'
import { Channel, ChannelNotification, Team, User } from '../models'

const workerName = 'channelThemesChangeNotifier'
const notificationType = 'themes_changed'


// helpers
//
function getLastSeenUserName(channel, SlackWeb) {
  return new Promise(async (resolve, reject) => {
    try {
      const lastSeenUserId = JSON.parse(channel.Team.responseBody).user_id
      const user = await User.findById(lastSeenUserId)
      if (user) {
        resolve(JSON.parse(user.responseBody).name)
      } else {
        SlackWeb.users.info(lastSeenUserId, (err, res) => {
          if (err = err || res.error) {
            console.log(errorMarker, workerName, 'getLastSeenUserName', err)
            resolve(null)
          } else {
            resolve(res.user.name)
          }
        })
      }
    } catch (err) {
      console.log(errorMarker, workerName, 'getLastSeenUserName', err)
      resolve(false)
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

  const SlackWeb = new WebClient(channel.Team.accessToken)
  const lastSeenUserName = await getLastSeenUserName(channel, SlackWeb)

  const channelNotification = await ChannelNotification.find({
    where: { channelId: channel.id, type: notificationType }
  })

  let text = []

  if (channelNotification) {
    text.push(lastSeenUserName ? `@${lastSeenUserName} adjusted my settings.` : 'New settings accepted.')
    text.push(`I will now give you advice on *${toSentence(themes)}* in this channel.`)
  } else {
    text.push(`Greetings, humans. I am ${appName},`)
    if (lastSeenUserName) text.push(`set up by @${lastSeenUserName},`)
    text.push(`here to give you advice on *${toSentence(themes)}* in this channel.`)
    text.push('You can always change that in my settings. Now let the mentoring begin!')
  }

  text = text.join(' ')

  SlackWeb.chat.postMessage(channel.id, text, { as_user: true }, async (err, res) => {
    if (err = err || res.error) {
      console.log(errorMarker, err, workerName, 'chat.postMessage')
      done(null)
    } else {
      // leave trace of notification
      await ChannelNotification.create({
        channelId: channel.id,
        type: notificationType,
        responseBody: JSON.stringify(res),
      })

      done(null, true)
    }
  })
}


export { perform }
