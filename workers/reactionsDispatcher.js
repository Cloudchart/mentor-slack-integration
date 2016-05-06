import momentTimezone from 'moment-timezone'
import { WebClient } from 'slack-client'
import { errorMarker } from '../lib'
import { Team, TimeSetting, MessagesUser, Message, User } from '../models'

const workerName = 'reactionsDispatcher'


// helpers
//
function sendMessages(user, messagesUsers, SlackWeb) {
  messagesUsers.forEach(messagesUser => {
    try {
      const attachments = JSON.parse(messagesUser.Message.responseBody).message.attachments

      const options = {
        as_user: true,
        unfurl_links: false,
        unfurl_media: false,
        attachments: JSON.stringify(attachments),
      }

      SlackWeb.chat.postMessage(user.imId, null, options, async (err, res) => {
        if (err = err || res.error) {
          console.log(errorMarker, err, workerName, 'sendMessages', 'chat.postMessage')
        }
      })
    } catch (err) {
      console.log(errorMarker, workerName, 'sendMessages', err)
    }
  })
}


function perform(teamId, done) {
  Team.find({
    include: [TimeSetting, User], where: { id: teamId }
  }).then(team => {
    const now = momentTimezone().tz(team.TimeSetting.tz)
    const startOfDay = now.startOf('day').format('YYYY-MM-DD HH:mm:ss')

    const jobs = team.Users.reduce((promiseChain, user) => {
      return promiseChain.then(async () => {
        try {
          const SlackWeb = new WebClient(team.accessToken)

          const messagesUsers = await MessagesUser.findAll({
            include: [Message],
            where: { userId: user.id, rate: 1, createdAt: { $gte: startOfDay } }
          })

          if (messagesUsers.length > 0) {
            const text = "Greetings, Master. Here is the advice you liked yesterday. It’s time to put it to good use!"

            SlackWeb.chat.postMessage(user.imId, text, { as_user: true }, async (err, res) => {
              if (err = err || res.error) {
                console.log(errorMarker, err, workerName, 'chat.postMessage')
              } else {
                sendMessages(user, messagesUsers, SlackWeb)
              }
            })
          }
        } catch (err) {
          console.log(errorMarker, workerName, err)
          done(false)
        }
      })
    }, Promise.resolve())

    jobs.then(() => done(null, true))
  }).catch(err => {
    console.log(errorMarker, workerName, err)
    done(false)
  })
}


export { perform }
