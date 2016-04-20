import { WebClient } from 'slack-client'
import { reactOnInsight } from './helpers'
import { errorMarker } from '../lib'
import { Channel, Message, Team } from '../models'

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


// get reactions
// determine rate
// react on insight
async function perform(messageId, insightId, topicId, done) {
  const message = await Message.find({ include: [{ model: Channel, include: [Team] }], where: { id: messageId } })
  if (!message) return done(null, true)

  const channelId = message.channelId
  const SlackWeb = new WebClient(message.Channel.Team.accessToken)

  SlackWeb.reactions.get({ channel: channelId, timestamp: message.timestamp }, async (err, data) => {
    if (err = err || data.error) {
      console.log(errorMarker, err, workerName, 'reactions.get')
      done(null)
    } else {
      if (data.message.reactions) {
        let rate = 0
        let positiveReactionsCounter = 0
        let negativeReactionsCounter = 0

        data.message.reactions.forEach(reaction => {
          if (positiveReactions.includes(reaction.name)) {
            positiveReactionsCounter += reaction.count || 0
          } else if (negativeReactions.includes(reaction.name)) {
            negativeReactionsCounter += reaction.count || 0
          }
        })

        if (positiveReactionsCounter === negativeReactionsCounter) return done(null, true)
        if (positiveReactionsCounter > negativeReactionsCounter) { rate += 1 } else { rate -= 1 }
        await reactOnInsight(rate, channelId, topicId, insightId)
        await updateChatMessage(message, rate, SlackWeb)
        done(null, true)
      } else {
        done(null, true)
      }
    }
  })
}


export { perform }
