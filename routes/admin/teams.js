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

      SlackWeb.dm.list(async (error, data) => {
        if (error = error || data.error) {
          console.log(errorMarker, err)
          res.redirect('/admin/teams')
        } else {
          users.forEach(user => {
            const im = data.ims.find(im => im.user === user.id)
            if (!im) return

            const attrs = {
              teamId: viewedTeam.id,
              imId: im.id,
              responseBody: JSON.stringify(user),
            }

            User.findOrCreate({
              where: { id: user.id }, defaults: attrs
            }).spread((user, created) => {
              if (!created) user.update(attrs)
            })
          })

          res.render('admin/team_users', {
            team: team,
            viewedTeam: { id: viewedTeam.id, name: viewedTeam.name },
            users: users,
          })
        }
      })
    }
  })
})

router.get('/chat/:id', checkTeamId, checkAuth, async (req, res, next) => {
  const user = await User.find({ include: [Team], where: { id: req.params.id } })
  if (!user) return res.status(404).json({ message: 'could not find user' })

  const SlackWeb = new WebClient(user.Team.accessToken)

  SlackWeb.dm.history(user.imId, {}, (error, data) => {
    if (error = error || data.error) {
      res.status(500).json({ error: error })
    } else {
      res.json({ messages: data.messages })
    }
  })
})


export default router
