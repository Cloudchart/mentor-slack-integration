import { Router } from 'express'
import { checkTeamId } from '../helpers'
import { checkAuth, getTeam, getFilteredAttrs } from './helpers'
import { appName } from '../../lib'
import { Survey, SurveyQuestion, SurveyAnswer } from '../../models'

const permittedAttrs = ['name', 'isActive']
const router = Router()


// actions
//
router.get('/', checkTeamId, checkAuth, async (req, res, next) => {
  const team = await getTeam(req.session.teamId)
  const surveys = await Survey.findAll()
  const questions = await SurveyQuestion.findAll()
  const answers = await SurveyAnswer.findAll()

  res.render('admin/surveys', {
    title: `${appName} Surveys`,
    team: team,
    surveys: surveys,
    questions: questions,
    answers: answers,
  })
})

router.post('/', checkTeamId, checkAuth, (req, res, next) => {
  const attrs = getFilteredAttrs(req.body, permittedAttrs)
  Survey.create(attrs).then(survey => {
    res.json(survey)
  }).catch(error => {
    res.status(500).json({ error })
  })
})

router.put('/:id', checkTeamId, checkAuth, (req, res, next) => {
  Survey.findById(req.params.id).then(survey => {
    const attrs = getFilteredAttrs(req.body, permittedAttrs)
    survey.update(attrs).then(survey => {
      res.json(survey)
    }).catch(error => {
      res.status(500).json({ error })
    })
  }).catch(error => {
    res.status(404).json({ message: 'not found' })
  })
})

router.delete('/:id', checkTeamId, checkAuth, (req, res, next) => {
  Survey.findById(req.params.id).then(survey => {
    survey.destroy()
    res.json({ message: 'ok' })
  }).catch(error => {
    res.status(404).json({ message: 'not found' })
  })
})


export default router
