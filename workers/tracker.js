import request from 'request'
import { WebClient } from 'slack-client'
import { toSentence } from 'underscore.string'

import { getSubscribedThemes } from './helpers'
import { errorMarker } from '../lib'
import { Team } from '../models'

const workerName = 'tracker'


// helpers
//
function getPayload(type, team, data) {
  return new Promise((resolve, reject) => {
    if (type === 'registered') {
      resolve({ text: `New team ${team.name} has registered, yay! :ghost:` })
    } else if (type === 'subscribed_to_channel') {
      const channelId = data.channelId
      const SlackWeb = new WebClient(team.accessToken)

      SlackWeb.channels.info(channelId, async (err, res) => {
        if (err = err || res.error) {
          console.log(errorMarker, err, workerName, 'channels.info')
          reject({})
        } else {
          let text = []
          text.push(`Team ${team.name} has subscribed #${res.channel.name} channel`)

          const themes = await getSubscribedThemes(channelId)
          if (themes.length > 0) {
            text.push(`to ${toSentence(themes)}`)
            themes.length === 1 ? text.push('theme') : text.push('themes')
          }

          resolve({ text: text.join(' ') })
        }
      })
    } else {
      resolve({})
    }
  })
}


// worker – tracks user activity
//
async function perform(type, data, done) {
  const team = await Team.findById(data.teamId)
  if (!team) return done(null)

  const payload = await getPayload(type, team, data)
  if (!payload.text) return done(null)

  const options = {
    url: process.env.SLACK_DEFAULT_WEBHOOK_URL,
    method: 'POST',
    json: true,
    body: payload
  }

  request(options, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      done(null, true)
    } else {
      console.log(errorMarker, error, workerName)
      done(null)
    }
  })
}


export { perform }
