import request from 'request'
import { appName, errorMarker } from '../lib'
import { Team, Channel } from '../models'

const workerName = 'statsDispatcher'


async function perform(done) {
  const teamsCount = await Team.count()
  const inactiveTeamsCount = await Team.count({ where: { isActive: false } })
  const channelsCount = await Channel.count()

  const text = `Hey meatb… everyone, here are some fresh stats from ${appName}:\n` +
    `Total teams: *${teamsCount}*\n` +
    `Inactive teams: *${inactiveTeamsCount}*\n` +
    `Subscribed channels: *${channelsCount}*`

  const options = {
    url: process.env.SLACK_DEFAULT_WEBHOOK_URL,
    method: 'POST',
    json: true,
    body: { text: text }
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
