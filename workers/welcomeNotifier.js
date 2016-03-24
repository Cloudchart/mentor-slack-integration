import { WebClient } from 'slack-client'
import { errorMarker } from '../lib'
import { getTeamOwner } from './helpers'
import { Team, TeamOwnerNotification } from '../models'

const workerName = 'welcomeNotifier'
const notificationType = 'welcome'


// helpers
//
function sendMessage(SlackWeb, teamOwner, done) {
  const text = "Hello, meatb… Master. I am fully operational now and ready to give you advice. You can star my advices for quick access, use reactions on them or pin the most imporant ones to the channel.\n\nNow let the mentoring begin!"

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
