import { Router } from 'express'
import { WebClient } from 'slack-client'
import { enqueue, checkTeamId } from './helpers'
import { Team, Channel } from '../models'

let router = Router()
let SlackDefaultWeb = new WebClient('')
const permittedAttrs = ['shouldSendMessagesAtOnce']


// helpers
//
function enqueueNotifications(channel, teamId) {
  if (channel.is_member) enqueue('channelThemesChangeNotifier', channel.id)
  enqueue('tracker', ['subscribed_to_channel', { teamId: teamId, channelId: channel.id }])
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
    let status = 'non_selected'
    const statuses = channels.map(channel => channel.status)
    const atLeastOneIsInvited = statuses.includes('invited')
    const atLeastOneIsUninvited = statuses.includes('uninvited')

    if (atLeastOneIsUninvited) status = 'awaiting_invitation'
    if (atLeastOneIsInvited && !atLeastOneIsUninvited) {
      status = 'ok'
      const channelIds = channels.filter(channel => channel.status == 'invited').map(channel => channel.id)
      enqueue('channelWelcomeNotifier', [channelIds])
    }

    res.json({ channels: channels, status: status })
  }).catch(error => {
    res.status(500).json({ error: error, status: 'error' })
  })
})

router.post('/', checkTeamId, async (req, res, next) => {
  const id = req.body.id
  const team = await Team.findById(req.session.teamId)
  await Channel.findOrCreate({ where: { id: id }, defaults: { teamId: team.id } })
  const SlackWeb = new WebClient(team.accessToken)

  SlackWeb.channels.info(id, (error, data) => {
    if (error = error || data.error) {
      res.status(500).json({ error })
    } else {
      enqueueNotifications(data.channel, team.id)
      res.status(201).json({ status: data.channel.is_member ? 'invited' : 'uninvited' })
    }
  })
})

router.put('/:id', checkTeamId, async (req, res, next) => {
  const { attr, value } = req.body

  if (permittedAttrs.includes(attr)) {
    const channel = await Channel.findById(req.params.id)
    if (channel.teamId !== req.session.teamId) return res.status(403).json({ message: 'unauthorized' })

    channel.update({ [attr]: value }).then(channel => {
      res.json({ [attr]: channel[attr] })
    }).catch(error => {
      res.status(500).json({ error })
    })
  } else {
    res.status(400).json({ message: 'bad request' })
  }
})

router.delete('/', checkTeamId, async (req, res, next) => {
  const id = req.body.id
  const channel = await Channel.findById(id)
  if (!channel) return res.status(404).json({ message: 'not found' })
  if (channel.teamId !== req.session.teamId) return res.status(403).json({ message: 'unauthorized' })

  await Channel.destroy({ where: { id: id } })
  res.json({ status: null })
})


export default router
export { getChannels }
