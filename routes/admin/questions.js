import { Router } from 'express'
import { checkTeamId } from '../helpers'
import { checkAuth, getFilteredAttrs } from './helpers'
import { appName } from '../../lib'
import { Survey, SurveyQuestion } from '../../models'

const permittedAttrs = ['name']
const router = Router({ mergeParams: true })


// actions
//
router.post('/', checkTeamId, checkAuth, (req, res, next) => {
  Survey.findById(req.params.surveyId).then(survey => {
    SurveyQuestion.create({ surveyId: survey.id }).then(surveyQuestion => {
      res.json(surveyQuestion)
    }).catch(error => {
      res.status(500).json({ error })
    })
  }).catch(error => {
    res.status(404).json({ message: 'not found' })
  })
})

router.put('/:id', checkTeamId, checkAuth, (req, res, next) => {
  // const attrs = getFilteredAttrs(req.body, permittedAttrs)
})

router.delete('/:id', checkTeamId, checkAuth, (req, res, next) => {
})


export default router
