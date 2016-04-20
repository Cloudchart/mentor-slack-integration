import { Router } from 'express'
import { WebClient } from 'slack-client'
import { checkTeamId } from '../helpers'
import { appName, botTeamId, errorMarker } from '../../lib'
import { Team, TeamOwner, User } from '../../models'

const router = Router()


// helpers
//
function checkAuth(req, res, next) {
  req.session.teamId === botTeamId ? next() : res.redirect('/')
}

function getTeam(id) {
  return new Promise(async (resolve, reject) => {
    const team = await Team.findById(id)
    resolve({ id: team.id, name: team.name, isAdmin: team.id === botTeamId })
  })
}

// actions
//
router.get('/', checkTeamId, checkAuth, async (req, res, next) => {
  const team = await getTeam(req.session.teamId)
  let teams = await Team.findAll()
  teams = teams.map(team => { return { id: team.id, name: team.name } })

  res.render('admin/teams', { title: `${appName} Slack Teams`, team: team, teams: teams })
})

router.get('/:id/users', checkTeamId, checkAuth, async (req, res, next) => {
  const team = await getTeam(req.session.teamId)
  const viewedTeam = await Team.findById(req.params.id)
  const SlackWeb = new WebClient(viewedTeam.accessToken)

  SlackWeb.users.list((error, data) => {
    if (error = error || data.error) {
      console.log(errorMarker, err)
      res.redirect('/admin/teams')
    } else {
      const users = data.members.filter(member => {
        return (
          !member.deleted && !member.is_restricted && !member.is_ultra_restricted &&
          !member.is_bot && member.name !== 'slackbot'
        )
      })

      console.log('@@@', users);

      SlackWeb.dm.list(async (error, data) => {
        if (error = error || data.error) {
          console.log(errorMarker, err)
          res.redirect('/admin/teams')
        } else {
          console.log('###', data.ims);

          users.forEach(user => {
            User.findOrCreate({ where: { id: user.id }, defaults: {
              teamId: viewedTeam.id,
              imId: data.ims.find(im => im.user === user.id).id,
              isPrimaryOwner: user.is_primary_owner,
              responseBody: JSON.stringify(user),
            } })
          })

          res.render('admin/team_users', { team: team, users: users })
        }
      })
    }
  })
})


// router.get('/:teamId/users', checkTeamId, checkAuth, async (req, res, next) => {
//   const team = await Team.findById(req.params.teamId)
//   const SlackWeb = new WebClient(team.accessToken)

//   SlackWeb.users.list((error, data) => {
//     if (error = error || data.error) {
//       res.status(500).json({ error: error })
//     } else {
//       const users = data.members.filter(member => {
//         return !member.deleted && !member.is_ultra_restricted && !member.is_bot
//       })

//       res.json({ users: users })
//     }
//   })
// })

// router.get('/:teamId/messages', checkTeamId, checkAuth, async (req, res, next) => {
//   const team = await Team.find({ include: [TeamOwner], where: { id: req.params.teamId } })
//   if (!team.TeamOwner) return res.status(404).json({ message: 'could not find team owner' })

//   const SlackWeb = new WebClient(team.accessToken)

//   SlackWeb.dm.history(team.TeamOwner.imId, {}, (error, data) => {
//     if (error = error || data.error) {
//       res.status(500).json({ error: error })
//     } else {
//       console.log('@@@', data);

//       res.json({ messages: data.messages })
//     }
//   })
// })


export default router
