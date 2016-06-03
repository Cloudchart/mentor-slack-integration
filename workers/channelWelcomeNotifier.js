import { WebClient } from 'slack-client'
import { toSentence } from 'underscore.string'
import { appName, errorMarker } from '../lib'
import { enqueue, sendInsight, getSubscribedThemes, getLastSeenUserName } from './helpers'
import { notificationType as channelNotificationType } from './channelReactionsNotifier'
import { Channel, ChannelNotification, Team } from '../models'

const workerName = 'channelWelcomeNotifier'
const notificationType = 'welcome'


// helpers
//
function enqueueChannelReactionsNotifier(channel) {
  return new Promise(async (resolve, reject) => {
    try {
      const channelNotification = await ChannelNotification.find({
        where: { channelId: channel.id, type: channelNotificationType }
      })
      if (channelNotification) return resolve(null)

      await enqueue('channelReactionsNotifier', channel.id)
      resolve(true)
    } catch (err) {
      console.log(errorMarker, workerName, 'enqueueChannelReactionsNotifier', err)
      resolve(false)
    }
  })
}

// notify channel about succesfull integration test
//
async function perform(channelId, type, done) {
  try {
    const channelNotification = await ChannelNotification.find({
      where: { channelId: channelId, type: notificationType }
    })
    if (channelNotification) return done(null)

    const channel = await Channel.find({ include: [Team], where: { id: channelId } })
    if (!channel) return done(null)

    const themes = await getSubscribedThemes(channel.id)
    if (themes.length === 0) return done(null)

    const lastSeenUserName = await getLastSeenUserName(channel.Team)

    // generate text
    let text = []
    text.push(`Greetings, humans. I am ${appName},`)
    if (lastSeenUserName) text.push(`set up by @${lastSeenUserName},`)
    text.push(`here to give you advice on *${toSentence(themes)}* in this channel.`)
    if (type === 'test') {
      text.push('Testing procedure successful.')
    } else {
      text.push('You can always change that in my settings')
    }
    text.push('Now let the mentoring begin!')
    text = text.join(' ')

    const SlackWeb = new WebClient(channel.Team.accessToken)

    SlackWeb.chat.postMessage(channel.id, text, { as_user: true }, async (err, res) => {
      if (err = err || res.error) {
        console.log(errorMarker, err, workerName, 'chat.postMessage')
        done(false)
      } else {
        // leave trace of notification
        await ChannelNotification.create({
          channelId: channel.id,
          type: notificationType,
          responseBody: JSON.stringify(res),
        })

        await sendInsight(channel)
        await enqueueChannelReactionsNotifier(channel)

        done(null, true)
      }
    })
  } catch (err) {
    console.log(errorMarker, workerName, err)
    done(false)
  }
}


export { perform }
