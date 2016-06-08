import { Router } from 'express'
import { checkTeamId } from '../helpers'
import { checkAuth, getTeam } from './helpers'
import { appName } from '../../lib'
import { Survey } from '../../models'

const permittedAttrs = ['name', 'isActive']
const router = Router()


// helpers
//
function getFilteredAttrs(attrs) {
  let filteredAttrs = {}
  Object.keys(attrs).forEach(key => {
    if (permittedAttrs.includes(key)) filteredAttrs[key] = attrs[key]
  })
  return filteredAttrs
}

// actions
//
router.get('/', checkTeamId, checkAuth, async (req, res, next) => {
  const team = await getTeam(req.session.teamId)
  const surveys = await Survey.findAll()
  res.render('admin/surveys', { title: `${appName} Surveys`, team: team, surveys: surveys })
})

router.post('/', checkTeamId, checkAuth, (req, res, next) => {
  const attrs = getFilteredAttrs(req.body)
  Survey.create(attrs).then(survey => {
    res.json(survey)
  }).catch(error => {
    res.status(500).json({ error })
  })
})

router.put('/:id', checkTeamId, checkAuth, (req, res, next) => {
  Survey.findById(req.params.id).then(survey => {
    const attrs = getFilteredAttrs(req.body)
    survey.update(attrs).then(survey => {
      res.json(survey)
    }).catch(error => {
      res.status(500).json({ error })
    })
  }).catch(error => {
    res.status(404).json({ message: 'not found' })
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
