import { Router } from 'express'
import { appName } from '../lib'
import { Survey, SurveyQuestion, SurveyAnswer, SurveyResult } from '../models'

const router = Router()


router.get('/:slug/:userId', async (req, res, next) => {
  Survey.find({ where: { slug: req.params.slug } }).then(survey => {
    res.render('surveys/show', {
      title: `${appName} ${survey.name} Quiz`,
      survey: survey,
    })
  }).catch(error => {
    res.status(404).render({ message: 'not found' })
  })
  // const questions = await SurveyQuestion.findAll()
  // const answers = await SurveyAnswer.findAll()
  // const results = await SurveyResult.findAll()
})


export default router
