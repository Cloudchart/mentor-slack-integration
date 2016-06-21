import path from 'path'
import { Router } from 'express'
import { appName, getClosestNumber } from '../lib'
import { Survey, SurveyQuestion, SurveyAnswer, SurveyResult, SurveyAnswerUser } from '../models'

const router = Router()


router.get('/:slug/:userId', async (req, res, next) => {
  Survey.find({
    where: { slug: req.params.slug },
    include: [{ model: SurveyQuestion, include: [SurveyAnswer] }, { model: SurveyResult }]
  }).then(async (survey) => {
    if (!survey.isActive) return res.redirect('/')
    req.session.surveyUserId = req.params.userId

    let userAnswers = await SurveyAnswerUser.findAll({
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

    userAnswers = userAnswers.map(userAnswer => {
      return {
        id: userAnswer.id,
        answerId: userAnswer.surveyAnswerId,
        isCorrect: userAnswer.SurveyAnswer.isCorrect,
      }
    })

    // render result
    if (userAnswers.length >= survey.SurveyQuestions.length) {
      const correctAnswersLength = userAnswers.filter(answer => answer.isCorrect).length
      const correctAnswersPercentage = correctAnswersLength / survey.SurveyQuestions.length * 100
      const closestPercentage = getClosestNumber(
        survey.SurveyResults.map(result => result.percentage),
        correctAnswersPercentage
      )
      const result = survey.SurveyResults.find(result => result.percentage === closestPercentage)

      res.render('surveys/result', {
        title: `${appName} Quiz – ${survey.name}`,
        survey: { id: survey.id, name: survey.name },
        result,
        correctAnswersLength,
        questionsLenght: survey.SurveyQuestions.length,
        resultImageUrl: path.join(process.env.ROOT_URL, `uploads/surveys`, result.imageUid),
      })
    // render questions
    } else {
      const questions = survey.SurveyQuestions.map(question => {
        return {
          id: question.id,
          name: question.name,
          answers: question.SurveyAnswers.map(answer => {
            return { id: answer.id, name: answer.name }
          }),
        }
      })

      res.render('surveys/show', {
        title: `${appName} ${survey.name} Quiz`,
        survey: { id: survey.id, name: survey.name },
        questions: questions,
        userAnswers: userAnswers,
      })
    }
  }).catch(error => {
    res.status(404).render({ message: 'not found' })
  })
})

router.post('/answer', (req, res, next) => {
  SurveyAnswer.findById(req.body.id).then(answer => {
    SurveyAnswerUser.findOrCreate({
      where: {
        userId: req.session.surveyUserId,
        surveyAnswerId: answer.id,
      }
    }).spread(async (userAnswer) => {
      const correctAnswerIds = await SurveyAnswer.findAll({
        where: { surveyQuestionId: answer.surveyQuestionId, isCorrect: true }
      }).map(surveyAnswer => surveyAnswer.id)

      res.json({
        userAnswer: {
          id: userAnswer.id,
          answerId: userAnswer.surveyAnswerId,
          isCorrect: answer.isCorrect,
        },
        correctAnswerIds: correctAnswerIds,
      })
    }).catch(error => {
      res.status(500).json({ error })
    })
  }).catch(error => {
    res.status(404).render({ message: 'not found' })
  })
})


export default router
