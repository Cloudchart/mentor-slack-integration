import { Router } from 'express'
import { WebClient } from 'slack-client'
import { checkTeamId } from '../helpers'
import { ivcTeamId } from '../../lib'
import { Team, TeamOwner } from '../../models'

const router = Router()


// helpers
//
function checkAuth(req, res, next) {
  req.session.teamId === ivcTeamId ? next() : res.redirect('/')
}

// actions
//
router.get('/', checkTeamId, checkAuth, async (req, res, next) => {
  let team = await Team.findById(req.session.teamId)
  let teams = await Team.findAll()
  team = { id: team.id, name: team.name }
  teams = teams.map(team => { return { id: team.id, name: team.name } })

  res.render('teams', { title: 'Virtual Mentor Slack Teams', team: team, teams: teams })
})

router.get('/:teamId/users', checkTeamId, checkAuth, async (req, res, next) => {
  const team = await Team.findById(req.params.teamId)
  const SlackWeb = new WebClient(team.accessToken)

  SlackWeb.users.list((error, data) => {
    if (error = error || data.error) {
      res.status(500).json({ error: error })
    } else {
      const users = data.members.filter(member => {
        return !member.deleted && !member.is_ultra_restricted && !member.is_bot
      })

      res.json({ users: users })
    }
  })
})

router.get('/:teamId/messages', checkTeamId, checkAuth, async (req, res, next) => {
  const team = await Team.find({ include: [TeamOwner], where: { id: req.params.teamId } })
  if (!team.TeamOwner) return res.status(404).json({ message: 'could not find team owner' })

  const SlackWeb = new WebClient(team.accessToken)

  SlackWeb.dm.history(team.TeamOwner.imId, {}, (error, data) => {
    if (error = error || data.error) {
      res.status(500).json({ error: error })
    } else {
      console.log('@@@', data);

      res.json({ messages: data.messages })
    }
  })
})


export default router
