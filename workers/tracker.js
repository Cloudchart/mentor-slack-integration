import request from 'request'
import { errorMarker, botName } from '../lib'
import { Team } from '../models'

const workerName = 'tracker'


// helpers
//
function getPayload(type, team, data) {
  switch (type) {
    case 'registered':
      return { text: `New team ${team.name} has registered, yay! :ghost:` }
    case 'subscribed_to_channel':
      return { text: `Team ${team.name} has subscribed @${botName} to #${data.channel.name} channel` }
  }
}


// worker – tracks user activity
//
async function perform(type, data, done) {
  const team = await Team.findById(data.teamId)
  if (!team) return done(null)

  const payload = getPayload(type, team, data)
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
