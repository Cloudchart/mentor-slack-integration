import { sample } from 'lodash'
import { WebClient } from 'slack-client'
import { errorMarker, botName } from '../lib'
import { Channel, Team, TeamNotification, User } from '../models'

const workerName = 'notInChannelNotifier'
const notificationType = 'not_in_channel'

const textOptions = [
  "Hello human. If you want me to work in your channel, then use this command:",
  "Hello Master. Use this command to make me fully operational in the channel you selected:",
  "Hey, to give you advice, I need to be invited to this channel:",
  "Hey! Use this command to invite me to the channel you selected and unleash my full power:"
]


// helpers
//
function sendMessage(channel, imId, SlackWeb, done) {
  SlackWeb.channels.info(channel.id, async (err, res) => {
    if (err = err || res.error) {
      console.log(errorMarker, err, workerName, 'channels.info')
      done(null)
    } else {
      // do nothing if bot is already in the channel
      if (res.channel.is_member) return done(null, true)

      // generate text
      let text = []
      text.push(sample(textOptions))
      text.push(`/invite @${botName} #${res.channel.name}`)
      text = text.join(' ')

      SlackWeb.chat.postMessage(imId, text, { as_user: true }, async (err, res) => {
        if (err = err || res.error) {
          console.log(errorMarker, err, workerName, 'chat.postMessage')
          done(null)
        } else {
          // leave trace of notification
          await TeamNotification.create({
            teamId: channel.Team.id,
            channelId: channel.id,
            type: notificationType,
            responseBody: JSON.stringify(res),
          })

          done(null, true)
        }
      })
    }
  })
}

// worker – notifies team owner if bot isn't invited to the channel
//
async function perform(channelId, done) {
  try {
    const channel = await Channel.find({
      include: [{ model: Team, include: [TeamNotification] }],
      where: { id: channelId }
    })
    if (!channel) return done(null, true)

    const teamNotifications = channel.Team.TeamNotifications.filter(tn => {
      return tn.channelId === channelId && tn.type === notificationType
    })

    // do nothing if owner has already received 2 messages of this type
    if (teamNotifications.length === 2) return done(null, true)
    // otherwise get imId and send message
    const SlackWeb = new WebClient(channel.Team.accessToken)
    const user = await User.findById(channel.Team.ownerId)
    if (user) {
      sendMessage(channel, user.imId, SlackWeb, done)
    } else {
      SlackWeb.dm.list((err, res) => {
        if (err = err || res.error) {
          console.log(errorMarker, err, workerName, 'dm.list')
          done(false)
        } else {
          const im = res.ims.find(im => im.user === channel.Team.ownerId)
          if (!im) return done(null)
          sendMessage(channel, im.id, SlackWeb, done)
        }
      })
    }
  } catch (err) {
    console.log(errorMarker, workerName, err)
    done(false)
  }
}


export { perform }
