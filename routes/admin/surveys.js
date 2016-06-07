import { Router } from 'express'
import { checkTeamId } from '../helpers'
import { checkAuth, getTeam } from './helpers'
import { appName } from '../../lib'
import { Survey } from '../../models'

const permittedAttrs = ['name', 'isActive']
const router = Router()


router.get('/', checkTeamId, checkAuth, async (req, res, next) => {
  const team = await getTeam(req.session.teamId)
  const surveys = await Survey.findAll()
  res.render('admin/surveys', { title: `${appName} Surveys`, team: team, surveys: surveys })
})

router.post('/', checkTeamId, checkAuth, (req, res, next) => {
  let attrs = req.body
  Object.keys(attrs).forEach(key => { if (!permittedAttrs.includes(key)) delete attrs[key] })

  Survey.create(attrs).then(survey => {
    res.json(survey)
  }).catch(error => {
    res.status(500).json({ error })
  })
})

router.delete('/', checkTeamId, checkAuth, (req, res, next) => {
  Survey.findById(req.body.id).then(survey => {
    survey.destroy()
    res.json({ message: 'ok' })
  }).catch(error => {
    res.status(404).json({ message: 'not found' })
  })
})


export default router
