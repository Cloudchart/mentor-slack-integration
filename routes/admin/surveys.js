import { Router } from 'express'
import { checkTeamId } from '../helpers'
import { checkAuth, getTeam } from './helpers'
import { appName } from '../../lib'
import { Survey } from '../../models'

const router = Router()


router.get('/', checkTeamId, checkAuth, async (req, res, next) => {
  const team = await getTeam(req.session.teamId)
  const surveys = await Survey.findAll()
  res.render('admin/surveys', { title: `${appName} Surveys`, team: team, surveys: surveys })
})


export default router
