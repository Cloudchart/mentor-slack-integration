import momentTimezone from 'moment-timezone'
import { Router } from 'express'
import { WebClient } from 'slack-client'
import { checkTeamId } from '../helpers'
import { appName, botTeamId, errorMarker } from '../../lib'
import { Team, TimeSetting, TeamOwner, User } from '../../models'
import { getAndSyncUsers } from '../../workers/helpers'

const router = Router()


// helpers
//
function checkAuth(req, res, next) {
  req.session.teamId === botTeamId ? next() : res.redirect('/')
}

function getTeam(id) {
  return new Promise(async (resolve, reject) => {
    const team = await Team.findById(id)
    resolve({ id: team.id, name: team.name, isAdmin: team.id === botTeamId })
  })
}

function isAvailableForChat(timeSetting) {
  const now = momentTimezone().tz(timeSetting.tz)
  const day = now.format('ddd')
  const time = now.format('HH:mm')
  return timeSetting.days.includes(day) && time >= timeSetting.startTime && time <= timeSetting.endTime
}

// actions
//
router.get('/', checkTeamId, checkAuth, async (req, res, next) => {
  const team = await getTeam(req.session.teamId)
  let teams = await Team.findAll({ include: [User], where: { isActive: true } })
  teams = teams.map(team => {
    const hasNewMessage = team.Users.map(user => user.hasNewMessage).includes(true)
    return {
      id: team.id,
      name: team.name,
      hasNewMessage: hasNewMessage,
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

  res.render('admin/users', {
    title: `${appName} Slack Users`,
    team: team,
    users: users,
    viewedTeam: {
      id: viewedTeam.id,
      name: viewedTeam.name,
      isAvailableForChat: isAvailableForChat(viewedTeam.TimeSetting),
    },
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
  if (!isAvailableForChat(user.Team.TimeSetting)) return res.status(412).json({ message: 'team is not available for chat' })

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
