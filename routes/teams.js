import { Router } from 'express'
import { checkTeamId } from './helpers'
import { Team } from '../models'

const router = Router()

// helpers
//
async function checkIVCTeam(req, res, next) {
  const team = await Team.findById(req.session.teamId)
  if (team.name === 'Insights.VC') {
    next()
  } else {
    res.redirect('/')
  }
}

router.get('/', checkTeamId, checkIVCTeam, async (req, res, next) => {
  const teams = await Team.findAll()
  res.json({ teams: teams })
})


export default router
