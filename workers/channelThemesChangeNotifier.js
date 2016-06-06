import { WebClient } from 'slack-client'
import { toSentence } from 'underscore.string'

import { appName, errorMarker } from '../lib'
import { getSubscribedThemes, getLastSeenUserName, getTeamOwnerImId, getChannelName } from './helpers'
import { Channel, ChannelNotification, Team, User } from '../models'

const workerName = 'channelThemesChangeNotifier'
const notificationType = 'themes_changed'


// helpers
//
function notifyTeamOwner(channel, lastSeenUserName, themes, SlackWeb) {
  return new Promise(async (resolve, reject) => {
    try {
      const teamOwnerImId = await getTeamOwnerImId(channel.Team)
      const channelName = await getChannelName(channel)

      let text = []
      text.push(`Hello, Master. Just to let you know that @${lastSeenUserName} adjusted my settings.`)
      text.push(`I will now give advice on *${toSentence(themes)}* in #${channelName} channel.`)
      text = text.join(' ')

      SlackWeb.chat.postMessage(teamOwnerImId, text, { as_user: true }, async (err, res) => {
        if (err = err || res.error) {
          console.log(errorMarker, workerName, 'notifyTeamOwner', 'chat.postMessage', err)
          resolve(null)
        } else {
          resolve(true)
        }
      })
    } catch (err) {
      console.log(errorMarker, workerName, 'notifyTeamOwner', err)
      resolve(false)
    }
  })
}


// notify channel if themes were changed
//
async function perform(channelId, done) {
  try {
    const channel = await Channel.findOne({ include: [Team], where: { id: channelId } })
    if (!channel) return done(null)

    const themes = await getSubscribedThemes(channel.id)
    if (themes.length === 0) return done(null)

    const lastSeenUserName = await getLastSeenUserName(channel.Team)

    let text = []
    text.push(lastSeenUserName ? `@${lastSeenUserName} adjusted my settings.` : 'New settings accepted.')
    text.push(`I will now give you advice on *${toSentence(themes)}* in this channel.`)
    text = text.join(' ')

    const SlackWeb = new WebClient(channel.Team.accessToken)

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
        // notify team owner about configuration update
        const lastSeenUserId = JSON.parse(channel.Team.responseBody).user_id
        if (lastSeenUserId && channel.Team.ownerId !== lastSeenUserId) {
          await notifyTeamOwner(channel, lastSeenUserName, themes, SlackWeb)
        }

        done(null, true)
      }
    })
  } catch (err) {
    console.log(errorMarker, workerName, err)
    done(false)
  }
}


export { perform }
