import { Router } from 'express'
import { checkTeamId } from '../helpers'
import { checkAuth, getFilteredAttrs } from './helpers'
import { appName } from '../../lib'
import { Survey, SurveyQuestion } from '../../models'

const permittedAttrs = ['name']
const router = Router()


// actions
//
router.post('/surveys/:surveyId/questions', checkTeamId, checkAuth, (req, res, next) => {
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

router.put('/questions/:id', checkTeamId, checkAuth, (req, res, next) => {
  SurveyQuestion.findById(req.params.id).then(question => {
    const attrs = getFilteredAttrs(req.body, permittedAttrs)
    question.update(attrs).then(question => {
      res.json(question)
    }).catch(error => {
      res.status(500).json({ error })
    })
  }).catch(error => {
    res.status(404).json({ message: 'not found' })
  })
})

router.delete('/questions/:id', checkTeamId, checkAuth, (req, res, next) => {
  SurveyQuestion.findById(req.params.id).then(question => {
    question.destroy()
    res.json({ message: 'ok' })
  }).catch(error => {
    res.status(404).json({ message: 'not found' })
  })
})


export default router
