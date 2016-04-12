import momentTimezone from 'moment-timezone'
import { WebClient } from 'slack-client'
import { queue } from '../initializers/node_resque'

import {
  eventMarker,
  errorMarker,
  noticeMarker,
} from '../lib'

import { getRandomUnratedInsight } from './helpers'
import { Channel, Team, TimeSetting } from '../models'

const workerName = 'insightsDispatcher'


// helpers
//
function itSatisfiesTimeSetting(channel) {
  const timeSetting = channel.Team.TimeSetting
  const now = momentTimezone().tz(timeSetting.tz)
  const day = now.format('ddd')
  const time = now.format('HH:mm')

  return (
    timeSetting.days.includes(day) &&
    time > timeSetting.startTime &&
    time <= timeSetting.endTime
  )
}

function isEveryoneAsleep(channelId, SlackWeb) {
  return new Promise((resolve, reject) => {
    SlackWeb.channels.info(channelId, (err, res) => {
      if (err = err || res.error) {
        console.log(errorMarker, err, workerName, 'channels.info')
        resolve(null)
      } else {
        let members = res.channel.members

        SlackWeb.users.list(1, (err, res) => {
          if (err = err || res.error) {
            console.log(errorMarker, err, workerName, 'users.list')
            resolve(null)
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

// for each selected channel
// check team time settings
// check if everyone is away
// request unrated insight
// enqueue messagesDispatcher
async function perform(done) {
  const channels = await Channel.findAll({ include: [{ model: Team, include: [TimeSetting] }] })

  const jobs = channels.reduce(async (promiseChain, channel) => {
    return promiseChain.then(async () => {
      if (!itSatisfiesTimeSetting(channel)) return
      const SlackWeb = new WebClient(channel.Team.accessToken)
      const everyoneIsAsleep = await isEveryoneAsleep(channel.id, SlackWeb)
      if (everyoneIsAsleep || everyoneIsAsleep === null) return

      const response = await getRandomUnratedInsight(channel.id)
      if (response) {
        queue.enqueue('slack-integration', 'messagesDispatcher', [
          channel, response.insight, response.topic
        ], () => {
          console.log(eventMarker, 'enqueued messagesDispatcher')
        })
      } else {
        console.log(noticeMarker, `couldn't find unrated insight for channel: ${channel.id}`)
      }
    })
  }, Promise.resolve())

  jobs.then(() => done(null, true))
}


export { perform }
