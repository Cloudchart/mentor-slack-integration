import { Router } from 'express'
import { appName } from '../lib'
import { Survey, SurveyQuestion, SurveyAnswer, SurveyResult, SurveyAnswerUser } from '../models'

const router = Router()


router.get('/:slug/:userId', async (req, res, next) => {
  Survey.find({
    where: { slug: req.params.slug },
    include: [{ model: SurveyQuestion, include: [SurveyAnswer] }, { model: SurveyResult }]
  }).then(async (survey) => {
    const questions = survey.SurveyQuestions.map(question => {
      return {
        id: question.id,
        name: question.name,
        answers: question.SurveyAnswers.map(answer => {
          return { id: answer.id, name: answer.name }
        }),
      }
    })

    // const results = survey.SurveyResults.map(result => {
    //   return {
    //     id: result.id,
    //     percentage: result.percentage,
    //     text: result.text,
    //     imageUid: result.imageUid,
    //   }
    // })

    const userAnswers = await SurveyAnswerUser.findAll({
      where: { userId: req.params.userId },
      include: [
        {
          model: SurveyAnswer,
          include: [
            { model: SurveyQuestion, where: { surveyId: survey.id } }
          ]
        }
      ]
    })

    res.render('surveys/show', {
      title: `${appName} ${survey.name} Quiz`,
      survey: { id: survey.id, name: survey.name },
      questions: questions,
      // results: results,
      userAnswers: userAnswers,
    })
  }).catch(error => {
    res.status(404).render({ message: 'not found' })
  })
})


export default router
