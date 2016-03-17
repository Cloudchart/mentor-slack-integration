import { Router } from 'express'
import { WebClient } from 'slack-client'
import { checkTeamId } from './checkers'
import { Team, Channel } from '../models'

let router = Router()
let SlackDefaultWeb = new WebClient('')


router.post('/', checkTeamId, async (req, res, next) => {
  let id = req.body.id
  let team = await Team.findById(req.session.teamId)
  let selectedChannel = await Channel.findOrCreate({ where: { id: id }, defaults: { teamId: team.id } })
  if (!selectedChannel) return res.status(500).json({ message: 'something went wrong' })

  let SlackWeb = new WebClient(team.accessToken)

  SlackWeb.channels.info(id, (error, data) => {
    if (error = error || data.error) {
      res.status(500).json({ error: error })
    } else {
      res.status(201).json({ status: data.channel.is_member ? 'invited' : 'uninvited' })
    }
  })
})

router.delete('/', checkTeamId, async (req, res, next) => {
  let id = req.body.id
  let team = await Team.findById(req.session.teamId)
  await Channel.destroy({ where: { id: id } })
  let SlackWeb = new WebClient(team.accessToken)

  SlackWeb.channels.info(id, (error, data) => {
    if (error = error || data.error) {
      res.status(500).json({ error: error })
    } else {
      res.json({ status: null })
    }
  })
})


export default router
