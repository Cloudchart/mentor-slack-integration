import { WebClient } from 'slack-client'
import { slugify } from 'underscore.string'
import { errorMarker } from '../lib'
import { getTeamOwner } from './helpers'
import { Team, TeamOwnerNotification } from '../models'

const workerName = 'welcomeNotifier'
const notificationType = 'welcome'


// helpers
//
function sendMessage(team, teamOwner, SlackWeb, done) {
  const configurationLink = `${process.env.ROOT_URL}/${slugify(team.name)}/configuration`

  const text = [
    "Hello, meatb… Master. Thank you for using me as your mentor.",
    `To make this battle bot fully operational, please select channels and topics on <${configurationLink}|configuration page>.`
  ].join(' ')

  SlackWeb.chat.postMessage(teamOwner.imId, text, { as_user: true }, async (err, res) => {
    if (err = err || res.error) {
      console.log(errorMarker, err, workerName, 'chat.postMessage')
      done(null)
    } else {
      // leave trace of notification
      await TeamOwnerNotification.create({
        teamOwnerId: teamOwner.id,
        type: notificationType,
      })

      done(null, true)
    }
  })
}

// worker – greets team owner
//
async function perform(teamId, done) {
  const team = await Team.findById(teamId)
  const SlackWeb = new WebClient(team.accessToken)
  const teamOwner = await getTeamOwner(team.id, SlackWeb)
  if (!teamOwner) {
    console.log(errorMarker, workerName, 'Did not find team owner for:', team.id)
    return done(null)
  }

  const teamOwnerNotifications = await TeamOwnerNotification.findOne({
    where: {
      teamOwnerId: teamOwner.id,
      type: notificationType,
    }
  })
  // do nothing if owner has already been notified
  if (teamOwnerNotifications) return done(null, true)
  // otherwise send message
  sendMessage(team, teamOwner, SlackWeb, done)
}


export { perform }
