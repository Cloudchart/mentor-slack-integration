import { WebClient } from 'slack-client'
import { errorMarker } from '../lib'
import { Team, User } from '../models'

const workerName = 'messageDispatcher'


// post message
// update last timestamp
async function perform(userId, text, done) {
  const user = await User.find({ include: [Team], where: { id: userId } })
  if (!user) return done(null)

  const SlackWeb = new WebClient(user.Team.accessToken)

  SlackWeb.chat.postMessage(user.imId, text, { as_user: true }, async (err, res) => {
    if (err = err || res.error) {
      console.log(errorMarker, err, workerName, 'chat.postMessage')
      done(null)
    } else {
      await user.update({ lastTimestamp: res.message.ts, hasNewMessage: false })
      done(null, true)
    }
  })
}


export { perform }
