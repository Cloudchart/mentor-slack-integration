import { WebClient } from 'slack-client'
import { errorMarker } from '../lib'
import { getTeamOwner } from './helpers'
import { Team, TeamOwnerNotification } from '../models'

const workerName = 'welcomeNotifier'
const notificationType = 'welcome'


// helpers
//
function sendMessage(SlackWeb, teamOwner, done) {
  const text = "Hello, meatb… Master. Thank you for using me as your mentor. To make this battle bot fully operational, please select channels and topics for me to post on."

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
  const teamOwnerNotifications = await TeamOwnerNotification.findOne({
    where: {
      teamOwnerId: teamOwner.id,
      type: notificationType,
    }
  })
  // do nothing if owner has already been notified
  if (teamOwnerNotifications) return done(null, true)
  // otherwise send message
  sendMessage(SlackWeb, teamOwner, done)
}


export { perform }
