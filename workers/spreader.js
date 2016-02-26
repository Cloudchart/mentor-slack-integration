import { WebClient } from 'slack-client'

import { callWebAppGraphQL } from '../utils'

import { Channel, Team } from '../models'
import { SlackChannel, Insight, InsightOrigin, UserTheme, UserThemeInsight } from '../models/web_app'


function findUnratedInsight(userId) {
  return UserThemeInsight.findOne({
    include: [{
      model: UserTheme,
      where: { status: 'subscribed' },
    }],
    where: {
      user_id: userId,
      rate: null,
    }
  })
}

async function sendMessage(channelId, userThemeInsight, done) {
  let channel = await Channel.findOne({ include: [Team], where: { id: channelId } })
  let SlackWeb = new WebClient(channel.Team.accessToken)

  // get insight content and origin
  let insight = await Insight.findById(userThemeInsight.insight_id)
  let insightOrigin = await InsightOrigin.findById(userThemeInsight.insight_id)

  let title = insightOrigin.title
  if (!title) { title = 'Source' }

  // generate text
  let text = `${insightOrigin.author}\n${insight.content} – <${insightOrigin.url}|${title}>`

  // post message
  SlackWeb.chat.postMessage(channelId, text, { as_user: true }, async (err, data) => {
    // TODO: bot isn't invited, send note to the team owner
    if (err) {
      console.log('Error:', err)
      done(null, true)
    // message sent, update rate to -1
    } else {
      console.log(data);
      await userThemeInsight.update({ rate: -1 })
      done(null, true)
    }
  })
}


// Worker (sends insights to a channel)
//
export let perform = async (done) => {
  // get all channel ids
  let channels = await Channel.findAll()
  let channelIds = channels.map(channel => channel.id)

  // get user ids from web app
  let slackChannels = await SlackChannel.findAll({ where: { id: channelIds } })
  // let userIds = slackChannels.map(channel => channel.user_id)

  // for each slack channel
  slackChannels.forEach(async (slackChannel) => {
    // try to find unrated insight
    let unratedInsight = await findUnratedInsight(slackChannel.user_id)
    // if found one, send it to slack channel
    if (unratedInsight) {
      sendMessage(slackChannel.id, unratedInsight, done)
    // if not, make graphql request for all subscribed themes and try again
    } else {
      let userThemes = await UserTheme.findAll({ where: { user_id: slackChannel.user_id, status: 'subscribed' } })

      let requests = userThemes.reduce((promiseChain, userTheme) => {
        return promiseChain.then(async () => {
          let userId = new Buffer(slackChannel.user_id).toString('base64')
          let themeId = new Buffer(userTheme.theme_id).toString('base64')

          await callWebAppGraphQL(slackChannel.id, 'GET', `
            {
              viewer {
                insights(userId: "${userId}" themeId: "${themeId}") {
                  edges {
                    node{id}
                  }
                }
              }
            }
          `)
        })
      }, Promise.resolve())

      requests.then(async () => {
        unratedInsight = await findUnratedInsight(slackChannel.user_id)

        if (unratedInsight) {
          sendMessage(slackChannel.id, unratedInsight, done)
        } else {
          done(null, `couldn't find unrated insight for slackChannel: ${slackChannel.id}`)
        }
      })
    }
  })

}
