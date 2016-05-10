import { sample } from 'lodash'
import { WebClient } from 'slack-client'
import { errorMarker, noticeMarker } from '../lib'
import { enqueue, getAllUnratedInsights } from './helpers'

const workerName = 'insightsDailyDispatcher'

const textOptions = [
  "Here’s your daily dose of advice Master. Use it wisely. With the stress on ”use“.",
  "Enjoy your daily advice, organic life-form. Share and put it to work like there’s no tomorrow! (You never know with us robots, right?)",
  "Your daily advice, Master. Don’t forget to react to it, so I can fine-tune my intricate machinery.",
  "Here’s today’s advice, human Master. With the advice to use it, on top.",
  "Today’s advice for you, Master. You’re welcome to share it with your fellow humans.",
  "What a day it would be without my advice? Oh yes, a day off.",
  "Today’s advice is ready for you. React to it, share it, put it to work, to make the world a better place."
]


// get text
// post message
// send all daily insights
async function perform(channel, done) {
  try {
    const SlackWeb = new WebClient(channel.Team.accessToken)
    if (!channel.shouldSendMessagesAtOnce) return done(null)

    const insights = await getAllUnratedInsights(channel.id)
    if (insights) {
      SlackWeb.chat.postMessage(channel.id, sample(textOptions), { as_user: true }, async (err, res) => {
        if (err = err || res.error) {
          console.log(errorMarker, err, workerName, 'chat.postMessage')
          done(null)
        } else {
          const jobs = insights.reduce((promiseChain, item) => {
            return promiseChain.then(() => {
              enqueue('insightsDispatcher', [channel, item.insight, item.topic])
            })
          }, Promise.resolve())

          jobs.then(() => done(null, true))
        }
      })
    } else {
      console.log(noticeMarker, workerName, "couldn't find all unrated insights for channel:", channel.id)
      done(null)
    }
  } catch (err) {
    console.log(errorMarker, workerName, err)
    done(false)
  }
}


export { perform }
