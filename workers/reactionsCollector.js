import { WebClient } from 'slack-client'
import { errorMarker } from '../lib'
import { Channel, Message, Team } from '../models'
import { UserThemeInsight } from '../models/web_app'

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
        let userThemeInsight = await UserThemeInsight.findById(userThemeInsightId)
        // TODO: reactions emoji comparison
        userThemeInsight.update({ rate: 1 })
      }

      done(null, true)
    }
  })
}
