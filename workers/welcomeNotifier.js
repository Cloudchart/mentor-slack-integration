import { WebClient } from 'slack-client'
import { slugify } from 'underscore.string'
import { errorMarker } from '../lib'
import { Team, TeamNotification } from '../models'

const workerName = 'welcomeNotifier'
const notificationType = 'welcome'


// helpers
//
function sendMessage(team, imId, SlackWeb, done) {
  const configurationLink = `${process.env.ROOT_URL}/${slugify(team.name)}/configuration`

  const text = [
    "Hello, meatb… Master. Thank you for using me as your mentor.",
    `To make this battle bot fully operational, please select channels and topics on <${configurationLink}|configuration page>.`
  ].join(' ')

  SlackWeb.chat.postMessage(imId, text, { as_user: true }, async (err, res) => {
    if (err = err || res.error) {
      console.log(errorMarker, err, workerName, 'chat.postMessage')
      done(false)
    } else {
      // leave trace of notification
      await TeamNotification.create({
        teamId: team.id,
        type: notificationType,
        responseBody: JSON.stringify(res),
      })

      done(null, true)
    }
  })
}

// worker – greets team owner
//
async function perform(teamId, done) {
  const team = await Team.find({ include: [TeamNotification], where: { id: teamId } })
  if (!team.ownerId) return done(false)
  // do nothing if owner has already been notified
  if (team.TeamNotifications.find(tn => tn.type === notificationType)) return done(null, true)

  const SlackWeb = new WebClient(team.accessToken)
  SlackWeb.dm.list((err, res) => {
    if (err = err || res.error) {
      console.log(errorMarker, err, workerName, 'dm.list')
      done(false)
    } else {
      const im = res.ims.find(im => im.user === team.ownerId)
      if (!im) return done(null)
      sendMessage(team, im.id, SlackWeb, done)
    }
  })
}


export { perform }
