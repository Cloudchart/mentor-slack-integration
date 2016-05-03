import { WebClient } from 'slack-client'
import { errorMarker } from '../lib'
import { Channel, ChannelNotification, Team } from '../models'

const workerName = 'channelReactionsNotifier'
const notificationType = 'reactions_reminder'


// notify channel about reactions
//
async function perform(channelId, done) {
  const channel = await Channel.find({ include: [Team], where: { id: channelId } })
  if (!channel) return done(null)

  const channelNotification = await ChannelNotification.find({
    where: { channelId: channel.id, type: notificationType }
  })
  if (channelNotification) return done(null)

  const SlackWeb = new WebClient(channel.Team.accessToken)
  const text = [
    "Hello humans. Do you know that you can use reactions on my advice?",
    "This will help me serve you better. Try now, I'm sure you're up to the challenge!"
  ].join(' ')

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


export { perform }
