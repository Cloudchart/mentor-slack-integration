import { Router } from 'express'
import { checkTeamId } from './helpers'
import { Team } from '../models'

const router = Router()


router.get('/', checkTeamId, async (req, res, next) => {
  let team = await Team.findById(req.session.teamId)
  if (team.name !== 'Insights.VC') return res.redirect('/')

  team = { id: team.id, name: team.name }
  let teams = await Team.findAll()
  teams = teams.map(team => { return { id: team.id, name: team.name } })

  res.render('teams', { title: 'Virtual Mentor Slack Teams', team: team, teams: teams })
})


export default router
