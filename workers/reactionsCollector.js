import { WebClient } from 'slack-client'
import { errorMarker } from '../lib'
import { Channel, Message, Team } from '../models'
import { UserThemeInsight } from '../models/web_app'

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
  'tired_face', 'angry', 'rage', '-1', 'thumbsdown', 'punch', 'dash'
]


// worker – collects reactions
//
export let perform = async (messageId, userThemeInsightId, done) => {
  let message = await Message.find({ include: [{ model: Channel, include: [Team] }], where: { id: messageId } })
  let SlackWeb = new WebClient(message.Channel.Team.accessToken)

  SlackWeb.reactions.get({ channel: message.channelId, timestamp: message.timestamp }, async (err, data) => {
    if (err = err || data.error) {
      console.log(errorMarker, err, 'reactions.get')
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
        const userThemeInsight = await UserThemeInsight.findById(userThemeInsightId)
        if (positiveReactionsCounter > negativeReactionsCounter) { rate = 1 } else { rate = -1 }
        await userThemeInsight.update({ rate: rate })
        done(null, true)
      }
    }
  })
}
