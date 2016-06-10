import multer from 'multer'
import { Router } from 'express'
import { checkTeamId } from '../helpers'
import { checkAuth, getFilteredAttrs } from './helpers'
import { appName } from '../../lib'
import { Survey, SurveyResult } from '../../models'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/surveys/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

const upload = multer({ storage: storage })
const permittedAttrs = ['percentage', 'text', 'image']
const router = Router()


// actions
//
router.post('/surveys/:surveyId/results', checkTeamId, checkAuth, (req, res, next) => {
  Survey.findById(req.params.surveyId).then(survey => {
    SurveyResult.create({ surveyId: survey.id }).then(surveyResult => {
      res.json(surveyResult)
    }).catch(error => {
      res.status(500).json({ error })
    })
  }).catch(error => {
    res.status(404).json({ message: 'not found' })
  })
})

router.put('/results/:id', checkTeamId, checkAuth, upload.single('image'), (req, res, next) => {
  SurveyResult.findById(req.params.id).then(result => {
    let attrs = getFilteredAttrs(req.body, permittedAttrs)
    if (req.file) attrs.imagePath = req.file.path.replace(/public/, '')

    result.update(attrs).then(result => {
      res.json(result)
    }).catch(error => {
      res.status(500).json({ error })
    })
  }).catch(error => {
    res.status(404).json({ message: 'not found' })
  })
})

router.delete('/results/:id', checkTeamId, checkAuth, (req, res, next) => {
  SurveyResult.findById(req.params.id).then(result => {
    result.destroy()
    res.json({ message: 'ok' })
  }).catch(error => {
    res.status(404).json({ message: 'not found' })
  })
})


export default router
