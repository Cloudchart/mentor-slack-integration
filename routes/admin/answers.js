import { Router } from 'express'
import { checkTeamId } from '../helpers'
import { checkAuth, getFilteredAttrs } from './helpers'
import { appName } from '../../lib'
import { SurveyQuestion, SurveyAnswer } from '../../models'

const permittedAttrs = ['name', 'isCorrect']
const router = Router()


// actions
//
router.post('/questions/:surveyQuestionId/answers', checkTeamId, checkAuth, (req, res, next) => {
  SurveyQuestion.findById(req.params.surveyQuestionId).then(question => {
    SurveyAnswer.create({ surveyQuestionId:question.id }).then(surveyAnswer => {
      res.json(surveyAnswer)
    }).catch(error => {
      res.status(500).json({ error })
    })
  }).catch(error => {
    res.status(404).json({ message: 'not found' })
  })
})

router.put('/answers/:id', checkTeamId, checkAuth, (req, res, next) => {
  SurveyAnswer.findById(req.params.id).then(answer => {
    const attrs = getFilteredAttrs(req.body, permittedAttrs)
    answer.update(attrs).then(answer => {
      res.json(answer)
    }).catch(error => {
      res.status(500).json({ error })
    })
  }).catch(error => {
    res.status(404).json({ message: 'not found' })
  })
})

router.delete('/answers/:id', checkTeamId, checkAuth, (req, res, next) => {
  SurveyAnswer.findById(req.params.id).then(answer => {
    answer.destroy()
    res.json({ message: 'ok' })
  }).catch(error => {
    res.status(404).json({ message: 'not found' })
  })
})


export default router
