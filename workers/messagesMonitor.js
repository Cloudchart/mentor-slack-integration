import { WebClient } from 'slack-client'

import { errorMarker } from '../lib'
import { User, Team } from '../models'

const workerName = 'messagesMonitor'


// helpers
//
function checkNewMessages(user) {
  return new Promise((resolve, reject) => {
    const SlackWeb = new WebClient(user.Team.accessToken)

    SlackWeb.dm.history(user.imId, {}, (err, res) => {
      if (err = err || res.error) {
        console.log(errorMarker, err, workerName, 'dm.history')
        resolve(null)
      } else {
        const messages = res.messages
        if (messages.length === 0) return resolve(null)
        const lastMessage = messages[0]

        if (lastMessage.ts > user.lastTimestamp) {
          user.update({ hasNewMessage: true }).then(() => {
            resolve(true)
          }).catch(err => {
            console.log(errorMarker, err, workerName, 'user.update')
            resolve(null)
          })
        } else {
          resolve(null)
        }
      }
    })
  })
}


// get im history for all users
// update hasNewMessage attr if lastTimestamp less than current
async function perform(done) {
  const users = await User.findAll({ include: [Team] })

  const jobs = users.reduce(async (promiseChain, user) => {
    return promiseChain.then(async () => {
      await checkNewMessages(user)
    })
  }, Promise.resolve())

  jobs.then(() => done(null, true))
}


export { perform }