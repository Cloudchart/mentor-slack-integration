import { WebClient } from 'slack-client'
import { errorMarker } from '../lib'
import { Channel, ChannelNotification, Team } from '../models'

const workerName = 'channelWelcomeNotifier'
const notificationType = 'welcome'


// helpers
//
function sendNotification(channel) {
  return new Promise(async (resolve, reject) => {
    try {
      const channelNotification = await ChannelNotification.find({
        where: { channelId: channel.id, type: notificationType }
      })
      if (channelNotification) return resolve(null)

      const SlackWeb = new WebClient(channel.Team.accessToken)
      const text = "Testing procedure successful. I will now send you advice according to the set schedule."

      SlackWeb.chat.postMessage(channel.id, text, { as_user: true }, async (err, res) => {
        if (err = err || res.error) {
          console.log(errorMarker, err, workerName, 'chat.postMessage')
          resolve(false)
        } else {
          // leave trace of notification
          await ChannelNotification.create({
            channelId: channel.id,
            type: notificationType,
            responseBody: JSON.stringify(res),
          })

          resolve(true)
        }
      })
    } catch (err) {
      console.log(errorMarker, workerName, 'sendNotification', err)
      resolve(false)
    }
  })
}

// notify channel about succesfull integration test
//
function perform(channelIds, done) {
  Channel.findAll({ include: [Team], where: { id: channelIds } }).then(channels => {
    const jobs = channels.reduce(async (promiseChain, channel) => {
      return promiseChain.then(async () => {
        await sendNotification(channel)
      })
    }, Promise.resolve())

    jobs.then(() => done(null, true))
  }).catch(err => {
    console.log(errorMarker, workerName, err)
    done(false)
  })
}


export { perform }
