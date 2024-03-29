import momentTimezone from 'moment-timezone'
import { Router } from 'express'
import { WebClient } from 'slack-client'

import { queue, enqueueAt, checkTeamId } from '../helpers'
import { checkAuth, getTeam } from './helpers'
import { appName, errorMarker } from '../../lib'
import { Team, TimeSetting, User } from '../../models'
import { getAndSyncUsers } from '../../workers/helpers'
import { getChannels } from '../channels'

const router = Router()


// helpers
//
function isAvailableForChat(timeSetting) {
  const now = momentTimezone().tz(timeSetting.tz)
  const day = now.format('ddd')
  const time = now.format('HH:mm')
  return timeSetting.days.includes(day) && time >= timeSetting.startTime && time <= timeSetting.endTime
}

function enqueueChatMessage(user, text) {
  return new Promise((resolve, reject) => {
    const timeSetting = user.Team.TimeSetting
    const time = momentTimezone().tz(timeSetting.tz).format('HH:mm')
    let morningTime = momentTimezone.tz(timeSetting.startTime, 'HH:mm', timeSetting.tz)
    if (time > timeSetting.startTime) morningTime = morningTime.add(1, 'day')

    queue.scheduledAt('slack-integration', 'messageDispatcher', [user.id, text], async (err, timestamps) => {
      if (timestamps.length > 0) {
        resolve(false)
      } else {
        await enqueueAt(morningTime.unix() * 1000, 'messageDispatcher', [user.id, text])
        resolve(true)
      }
    })
  })
}

// actions
//
router.get('/', checkTeamId, checkAuth, async (req, res, next) => {
  const team = await getTeam(req.session.teamId)
  let teams = await Team.findAll({ include: [User], where: { isActive: true } })
  teams = teams.map(team => {
    const hasNewMessage = team.Users.map(user => user.hasNewMessage).includes(true)
    const hasMessages = team.Users.filter(user => user.lastTimestamp).length > 0
    return {
      id: team.id,
      name: team.name,
      hasNewMessage: hasNewMessage,
      hasMessages: hasMessages,
    }
  })
  res.render('admin/teams', { title: `${appName} Slack Teams`, team: team, teams: teams })
})

router.get('/:id/users', checkTeamId, checkAuth, async (req, res, next) => {
  const team = await getTeam(req.session.teamId)
  const viewedTeam = await Team.find({ include: [User, TimeSetting], where: { id: req.params.id } })

  let users = await getAndSyncUsers(viewedTeam)
  users = users.map(user => {
    const savedUser = viewedTeam.Users.find(item => item.id === user.id)
    const hasNewMessage = savedUser && savedUser.hasNewMessage
    const hasLastTimestamp = savedUser && savedUser.lastTimestamp
    return Object.assign(user, { hasNewMessage: hasNewMessage, hasLastTimestamp: hasLastTimestamp })
  })

  getChannels(viewedTeam).then(channels => {
    res.render('admin/users', {
      title: `${appName} Slack Users`,
      team: team,
      users: users,
      channels: channels,
      viewedTeam: {
        id: viewedTeam.id,
        name: viewedTeam.name,
        isAvailableForChat: isAvailableForChat(viewedTeam.TimeSetting),
      },
    })
  }).catch(error => {
    res.status(500).render('error', { message: error, error: {} })
  })
})

router.get('/chat/:id', checkTeamId, checkAuth, async (req, res, next) => {
  const user = await User.find({ include: [Team], where: { id: req.params.id } })
  if (!user) return res.status(404).json({ message: 'could not find user' })

  const SlackWeb = new WebClient(user.Team.accessToken)

  SlackWeb.dm.history(user.imId, {}, (error, data) => {
    if (error = error || data.error) {
      res.status(500).json({ error: error })
    } else {
      const messages = data.messages

      if (messages.length > 0) {
        user.update({
          lastTimestamp: messages[0].ts, hasNewMessage: false
        }).then(() => {
          res.json({ messages: messages })
        }).catch(error => {
          res.status(500).json({ error: error })
        })
      } else {
        res.json({ messages: messages })
      }
    }
  })
})

router.post('/chat/:id', checkTeamId, checkAuth, async (req, res, next) => {
  const user = await User.find({ include: [{ model: Team, include: [TimeSetting] }], where: { id: req.params.id } })
  if (!user) return res.status(404).json({ message: 'could not find user' })
  if (!isAvailableForChat(user.Team.TimeSetting)) {
    const isChatMessageEnqueued = await enqueueChatMessage(user, req.body.text)
    if (isChatMessageEnqueued) {
      return res.json({ message: 'enqueued' })
    } else {
      return res.json({ message: 'not enqueued' })
    }
  }

  const SlackWeb = new WebClient(user.Team.accessToken)

  SlackWeb.chat.postMessage(user.imId, req.body.text, { as_user: true }, (error, data) => {
    if (error = error || data.error) {
      res.status(500).json({ error: error })
    } else {
      const message = data.message

      user.update({
        lastTimestamp: message.ts, hasNewMessage: false
      }).then(() => {
        res.json({ message: message })
      }).catch(error => {
        res.status(500).json({ error: error })
      })
    }
  })
})


export default router
