import { Router } from 'express'
import { checkTeamId } from './checkers'
import { TimeSetting } from '../models'

let router = Router()
const permittedAttrs = ['tz', 'startTime', 'endTime', 'days']


router.put('/', checkTeamId, async (req, res, next) => {
  const { attr, value } = req.body

  if (permittedAttrs.includes(attr)) {
    let timeSetting = await TimeSetting.find({ where: { teamId: req.session.teamId } })
    timeSetting.update({ [attr]: value }).then(timeSetting => {
      res.json({ [attr]: timeSetting[attr] })
    }).catch(error => {
      res.status(400).json({ error })
    })
  } else {
    res.status(400).json({ message: 'bad request' })
  }
})


export default router
