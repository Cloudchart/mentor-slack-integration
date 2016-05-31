import { sample } from 'lodash'
import { WebClient } from 'slack-client'
import { errorMarker, botName } from '../lib'
import { getLastSeenUserImId } from './helpers'
import { Channel, TeamNotification, Team } from '../models'

const workerName = 'channelInviteNotifier'
const notificationType = 'channel_invite'

const textOptions = [
  "I need to be invited to the channel you selected. Just use this command:",
  "Use this command to make me fully operational in the channel you selected:",
  "Hey, use this command to invite me to the channel you selected and unleash my full power:"
]


// notify team last seen user about channel invite requirement
//
async function perform(channelId, channelName, done) {
  try {
    const channel = await Channel.findOne({
      include: { model: Team, include: [TeamNotification] },
      where: { id: channelId }
    })

    if (!channel) return done(null)
    if (channel.Team.TeamNotifications.find(tn => tn.type === notificationType)) return done(null, true)

    const lastSeenUserImId = await getLastSeenUserImId(channel.Team)
    const SlackWeb = new WebClient(channel.Team.accessToken)

    // generate text
    let text = []
    text.push(sample(textOptions))
    text.push(`/invite @${botName} #${channelName}`)
    text = text.join(' ')

    SlackWeb.chat.postMessage(lastSeenUserImId, text, { as_user: true }, async (err, res) => {
      if (err = err || res.error) {
        console.log(errorMarker, workerName, 'chat.postMessage', err)
        done(false)
      } else {
        // leave trace of notification
        await TeamNotification.create({
          teamId: channel.Team.id,
          type: notificationType,
          responseBody: JSON.stringify(res),
        })

        done(null, true)
      }
    })
  } catch (err) {
    console.log(errorMarker, workerName, err);
    done(false)
  }

}


export { perform }
