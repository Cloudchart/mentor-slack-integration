import { WebClient } from 'slack-client'
import { errorMarker } from '../lib'
import { Channel, ChannelNotification, Team, Message } from '../models'

const workerName = 'channelReactionsNotifier'
const notificationType = 'reactions_reminder'
const reactionSamples = ['-1', 'confused', 'clap', 'smile']


// notify channel about reactions
//
async function perform(channelId, done) {
  try {
    const channel = await Channel.find({ include: [Team, Message], where: { id: channelId } })
    if (!channel) return done(null)
    if (channel.Messages.length === 0) return done(null)

    const SlackWeb = new WebClient(channel.Team.accessToken)
    const text = [
      "⇧ You can use reactions on my advice.",
      "This will help me serve you better. Try now, I'm sure you're up to the challenge!"
    ].join(' ')

    SlackWeb.chat.postMessage(channel.id, text, { as_user: true }, async (err, res) => {
      if (err = err || res.error) {
        console.log(errorMarker, workerName, 'chat.postMessage', err)
        done(null)
      } else {
        // leave trace of notification
        await ChannelNotification.create({
          channelId: channel.id,
          type: notificationType,
          responseBody: JSON.stringify(res),
        })
        // add reaction samples
        reactionSamples.forEach(name => {
          SlackWeb.reactions.add(name, { channel: res.channel, timestamp: channel.Messages[0].timestamp })
        })

        done(null, true)
      }
    })
  } catch (err) {
    console.log(errorMarker, workerName, err)
    done(false)
  }
}


export { perform, notificationType }
