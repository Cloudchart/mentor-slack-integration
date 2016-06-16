import fs from 'fs'
import multer from 'multer'
import mime from 'mime'
import { Router } from 'express'

import { checkTeamId } from '../helpers'
import { checkAuth, getFilteredAttrs } from './helpers'
import { appName } from '../../lib'
import { Survey, SurveyResult } from '../../models'

const acceptedMimetypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif']

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + '/../../public/uploads/surveys/')
  },
  filename: (req, file, cb) => {
    cb(null, `result-${file.fieldname}-${Date.now()}.${mime.extension(file.mimetype)}`)
  },
})

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    acceptedMimetypes.includes(file.mimetype) ? cb(null, true) : cb(null, false)
  },
})

const permittedAttrs = ['percentage', 'title', 'text', 'image']
const router = Router()


// helpers
//
function removeImage(uid) {
  const imageFullPath = __dirname + '/../../public/uploads/surveys/' + uid
  fs.exists(imageFullPath, (exists) => {
    if (exists) fs.unlink(imageFullPath)
  })
}

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
    if (req.file) {
      removeImage(result.imageUid)
      attrs.imageUid = req.file.filename
    }

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
    removeImage(result.imageUid)
    result.destroy()
    res.json({ message: 'ok' })
  }).catch(error => {
    res.status(404).json({ message: 'not found' })
  })
})


export default router
