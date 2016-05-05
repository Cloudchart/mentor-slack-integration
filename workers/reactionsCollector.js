import momentTimezone from 'moment-timezone'
import { WebClient } from 'slack-client'
import { reactOnInsight } from './helpers'
import { errorMarker } from '../lib'
import { Channel, Message, MessagesUser, Team } from '../models'

const workerName = 'reactionsCollector'

const positiveReactions = [
  'smile', 'laughing', 'blush', 'smiley', 'relaxed', 'smirk', 'heart_eyes', 'kissing_heart',
  'kissing_closed_eyes', 'relieved', 'satisfied', 'wink', 'grinning', 'kissing', 'stuck_out_tongue',
  'kissing_smiling_eyes', 'sweat_smile', 'joy', 'astonished', 'yum', 'sunglasses', '+1', 'thumbsup',
  'point_up_2', 'point_up', 'clap', 'pray', 'metal', 'simple_smile', 'ok_hand', 'white_check_mark',
  'heart', 'muscle'
]

const negativeReactions = [
  'grin', 'flushed', 'worried', 'frowning', 'anguished', 'open_mouth', 'grimacing', 'confused',
  'hushed', 'expressionless', 'unamused', 'sweat', 'disappointed_relieved', 'weary', 'pensive',
  'disappointed', 'confounded', 'fearful', 'cold_sweat', 'persevere', 'cry', 'sob', 'scream',
  'tired_face', 'angry', 'rage', '-1', 'thumbsdown', 'punch', 'dash', 'hankey'
]


// helpers
//
function updateChatMessage(message, rate, SlackWeb) {
  return new Promise((resolve, reject) => {
    const emoji = rate === 1 ? ':+1:' : ':-1:'
    const color = rate === 1 ? '#56AB49' : '#D32E30'

    let attachments = JSON.parse(message.responseBody).message.attachments
    attachments[0].text += `\n${emoji}`
    attachments[0].color = color

    const options = {
      as_user: true,
      attachments: JSON.stringify(attachments),
    }

    SlackWeb.chat.update(message.timestamp, message.channelId, null, options, (err, data) => {
      if (err = err || data.error) {
        console.log(errorMarker, err, workerName, 'chat.update')
        resolve(null)
      } else {
        resolve(true)
      }
    })
  })
}

function saveUserLikes(message, userIds) {
  userIds.forEach(userId => {
    MessagesUser.findOrCreate({ where: { messageId: message.id, userId: userId, rate: 1 } })
  })
}


// for each yesterday message, get reaction
// determine rate and send mutation to web app
function perform(channel, done) {
  const now = momentTimezone().tz(channel.Team.TimeSetting.tz)
  const yesterday = now.subtract(1, 'day')
  const yesterdayStart = yesterday.startOf('day').format('YYYY-MM-DD HH:mm:ss')
  const yesterdayEnd = yesterday.endOf('day').format('YYYY-MM-DD HH:mm:ss')

  Message.findAll({
    where: {
      channelId: channel.id,
      createdAt: { $between: [yesterdayStart, yesterdayEnd] }
    }
  }).then(messages => {

    const jobs = messages.reduce((promiseChain, message) => {
      return promiseChain.then(() => {
        const SlackWeb = new WebClient(channel.Team.accessToken)

        SlackWeb.reactions.get({ channel: channel.id, timestamp: message.timestamp }, async (err, data) => {
          if (err = err || data.error) {
            console.log(errorMarker, err, workerName, 'reactions.get')
          } else if (data.message.reactions) {
            let rate = 0
            let positiveReactionsCounter = 0
            let negativeReactionsCounter = 0

            data.message.reactions.forEach(reaction => {
              if (positiveReactions.includes(reaction.name)) {
                positiveReactionsCounter += reaction.count || 0
                saveUserLikes(message, reaction.users)
              } else if (negativeReactions.includes(reaction.name)) {
                negativeReactionsCounter += reaction.count || 0
              }
            })

            if (positiveReactionsCounter === negativeReactionsCounter) return
            if (positiveReactionsCounter > negativeReactionsCounter) { rate += 1 } else { rate -= 1 }
            await reactOnInsight(rate, channel.id, message.topicId, message.insightId)
            await updateChatMessage(message, rate, SlackWeb)
          }
        })
      })
    }, Promise.resolve())

    jobs.then(() => done(null, true))
  }).catch(err => {
    console.log(errorMarker, workerName, err);
    done(false)
  })
}


export { perform }
