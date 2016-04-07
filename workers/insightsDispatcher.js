import moment from 'moment-timezone'
import { WebClient } from 'slack-client'
import { queue } from '../initializers/node_resque'

import {
  eventMarker,
  errorMarker,
  noticeMarker,
  reactionsCollectorDelay,
  notInChannelNotifierDelay,
} from '../lib'

import { callWebAppGraphQL } from '../routes/helpers'
import { Channel, Message, Team, TimeSetting } from '../models'
import { SlackChannel, Insight, InsightOrigin, UserTheme, UserThemeInsight } from '../models/web_app'

const workerName = 'insightsDispatcher'


// helpers
//
function enqueueNotInChannelNotifier(channelId, done) {
  queue.scheduledAt('slack-integration', 'notInChannelNotifier', channelId, async (err, timestamps) => {
    // don't enqueue if already enqueued
    if (timestamps.length > 0) {
      done(null, true)
    } else {
      queue.enqueueAt(Date.now() + notInChannelNotifierDelay, 'slack-integration', 'notInChannelNotifier', channelId, () => {
        console.log(eventMarker, 'enqueued notInChannelNotifier')
        done(null, true)
      })
    }
  })
}

function isContraryToTimeSetting(channel) {
  const timeSetting = channel.Team.TimeSetting
  const now = moment().tz(timeSetting.tz)
  const day = now.format('ddd')
  const time = now.format('HH:mm')

  return !(
    timeSetting.days.includes(day) &&
    // TODO: change to condition to >
    time >= timeSetting.startTime &&
    time <= timeSetting.endTime
  )
}

function isEveryoneAsleep(SlackWeb, channelId) {
  return new Promise((resolve, reject) => {
    SlackWeb.channels.info(channelId, (err, res) => {
      if (err = err || res.error) {
        console.log(errorMarker, err, workerName, 'channels.info')
        reject()
      } else {
        let members = res.channel.members

        SlackWeb.users.list(1, (err, res) => {
          if (err = err || res.error) {
            console.log(errorMarker, err, workerName, 'users.list')
            reject()
          } else {
            let activeUsers = res.members.filter(member => {
              return (
                members.includes(member.id) &&
                !member.deleted &&
                !member.is_ultra_restricted &&
                !member.is_bot &&
                member.presence === 'active'
              )
            })

            resolve(activeUsers.length === 0)
          }
        })
      }
    })
  })
}

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
  // find channel
  let channel = await Channel.findOne({
    include: [{ model: Team, include: [TimeSetting] }],
    where: { id: channelId }
  })
  // init web client
  let SlackWeb = new WebClient(channel.Team.accessToken)

  // do nothing if it's contrary to the time settings
  if (isContraryToTimeSetting(channel)) return done(null, true)
  // do nothing if everyone is away
  let everyoneIsAsleep = await isEveryoneAsleep(SlackWeb, channel.id)
  if (everyoneIsAsleep) return done(null, true)

  // get insight content and origin
  let insight = await Insight.findById(userThemeInsight.insight_id)
  let insightOrigin = await InsightOrigin.findById(userThemeInsight.insight_id)

  // generate text
  let text = insight.content
  let attachments = [{
    text: `${insightOrigin.author}\n<${insightOrigin.url}|${insightOrigin.title}>`
  }]

  let options = {
    as_user: true,
    unfurl_links: false,
    unfurl_media: false,
    attachments: JSON.stringify(attachments),
  }

  // post message
  SlackWeb.chat.postMessage(channel.id, text, options, async (err, res) => {
    if (err = err || res.error) {
      // if bot isn't invited, enqueue notInChannelNotifier
      if (err === 'not_in_channel') {
        enqueueNotInChannelNotifier(channel.id, done)
      } else {
        console.log(errorMarker, err, workerName, 'chat.postMessage')
        done(null, true)
      }
    // message sent, update rate, save output and enqueue reactionsCollector
    } else {
      userThemeInsight.update({ rate: 0 })
      let message = await Message.create({
        channelId: res.channel,
        timestamp: res.ts,
        responseBody: JSON.stringify(res),
      })

      queue.enqueueAt(Date.now() + reactionsCollectorDelay, 'slack-integration', 'reactionsCollector', [message.id, userThemeInsight.id], () => {
        console.log(eventMarker, 'enqueued reactionsCollector')
        done(null, true)
      })
    }
  })
}


// worker – sends insights to a channel
//
async function perform(done) {
  // get all channel ids
  let channels = await Channel.findAll()
  let channelIds = channels.map(channel => channel.id)

  // get user ids from web app
  let slackChannels = await SlackChannel.findAll({ where: { id: channelIds } })

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
          console.log(noticeMarker, `couldn't find unrated insight for slackChannel: ${slackChannel.id}`)
          done(null)
        }
      })
    }
  })

}


export { perform }
