import { Router } from 'express'
import { WebClient } from 'slack-client'
import { Queue, checkTeamId } from './helpers'
import { Team, Channel } from '../models'

let router = Router()
let SlackDefaultWeb = new WebClient('')


// helpers
//
function enqueueSubscribeNotification(teamId, channel) {
  Queue.connect(() => {
    Queue.enqueue('slack-integration', 'tracker',
      ['subscribed_to_channel', { teamId: teamId, channel: channel }]
    )
  })
}

function getChannels(team) {
  return new Promise(async (resolve, reject) => {
    const teamChannels = await Channel.findAll({ where: { teamId: team.id } })
    const selectedChannelIds = teamChannels.map(channel => channel.id)
    const SlackWeb = new WebClient(team.accessToken)

    SlackWeb.channels.list(true, (err, data) => {
      if (err = err || data.error) {
        reject(err)
      } else {
        const channels = data.channels.map(channel => {
          let status = null
          if (selectedChannelIds.includes(channel.id)) {
            status = channel.is_member ? 'invited' : 'uninvited'
          }

          return {
            id: channel.id,
            name: channel.name,
            status: status,
          }
        })

        resolve(channels)
      }
    })
  })
}

router.get('/', checkTeamId, async (req, res, next) => {
  const team = await Team.findById(req.session.teamId)

  getChannels(team).then(channels => {
    res.json({ channels: channels })
  }).catch(error => {
    res.status(500).json({ error: error })
  })
})

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
      enqueueSubscribeNotification(team.id, data.channel)
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

router.post('/notify', async (req, res, next) => {
  Queue.connect(() => {
    Queue.enqueue('slack-integration', 'channelThemesChangeNotifier', req.body.id)
  })

  res.json({ message: 'ok' })
})


export default router
export { getChannels }
