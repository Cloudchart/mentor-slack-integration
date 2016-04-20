import { sample } from 'lodash'
import { WebClient } from 'slack-client'
import { errorMarker, botName } from '../lib'
import { getTeamOwner } from './helpers'
import { Channel, Team, TeamOwner, TeamOwnerNotification } from '../models'

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
function sendMessage(SlackWeb, teamOwner, channelId, done) {
  SlackWeb.channels.info(channelId, async (err, res) => {
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

      SlackWeb.chat.postMessage(teamOwner.imId, text, { as_user: true }, async (err, res) => {
        if (err = err || res.error) {
          console.log(errorMarker, err, workerName, 'chat.postMessage')
          done(null)
        } else {
          // leave trace of notification
          await TeamOwnerNotification.create({
            teamOwnerId: teamOwner.id,
            channelId: channelId,
            type: notificationType
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
  const channel = await Channel.findOne({ include: [Team], where: { id: channelId } })
  if (!channel) return done(null, true)

  const SlackWeb = new WebClient(channel.Team.accessToken)
  const teamOwner = await getTeamOwner(channel.Team.id, SlackWeb)
  if (!teamOwner) {
    console.log(errorMarker, workerName, 'Did not find team owner for:', channel.Team.id)
    return done(null)
  }

  const teamOwnerNotifications = await TeamOwnerNotification.findAll({
    where: {
      teamOwnerId: teamOwner.id,
      channelId: channelId,
      type: notificationType
    }
  })
  // do nothing if owner has already received 2 messages of this type
  if (teamOwnerNotifications.length === 2) return done(null, true)
  // otherwise try to send message
  sendMessage(SlackWeb, teamOwner, channel.id, done)
}


export { perform }
