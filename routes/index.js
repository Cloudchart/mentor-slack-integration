import URL from 'url'
import moment from 'moment-timezone'

import { Router } from 'express'
import { WebClient } from 'slack-client'
import { slugify } from 'underscore.string'

import { appName, botTeamId, errorMarker } from '../lib'
import { getChannels } from './channels'
import { enqueue, checkTeamId } from './helpers'
import { Team, Channel, TimeSetting } from '../models'

const router = Router()
const SlackWebClient = new WebClient('')

// helpers
//
function enqueueNotifications(teamId) {
  enqueue('welcomeNotifier', teamId)
  enqueue('tracker', ['registered', { teamId: teamId }])
}

async function initTimeSetting(req, res, next) {
  await TimeSetting.findOrCreate({
    where: { teamId: req.session.teamId },
    defaults: {
      tz: moment.tz.guess() || 'America/Los_Angeles',
      startTime: '10:00',
      endTime: '22:00',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    }
  })
  next()
}

function getSlackButtonUrl() {
  return URL.format({
    protocol: 'https',
    hostname: 'slack.com',
    pathname: '/oauth/authorize',
    query: {
      scope: 'bot',
      client_id: process.env.SLACK_CLIENT_ID,
      redirect_uri: process.env.SLACK_CLIENT_OAUTH_REDIRECT_URI,
      state: process.env.SLACK_CLIENT_OAUTH_STATE,
    }
  })
}

function getTelegramButtonUrl() {
  return 'http://telegram.me/thementorbot'
}

// landing
//
router.get('/', (req, res, next) => {
  res.render('landing', {
    title: `Add ${appName} to Slack and Telegram`,
    slackButtonUrl: getSlackButtonUrl(),
    telegramButtonUrl: getTelegramButtonUrl(),
  })
})

// auth
//
router.get('/logout', (req, res, next) => {
  req.session.teamId = null
  res.redirect('/')
})

router.get('/oauth/callback', (req, res, next) => {
  if (req.query.state === process.env.SLACK_CLIENT_OAUTH_STATE) {
    SlackWebClient.oauth.access(
      process.env.SLACK_CLIENT_ID,
      process.env.SLACK_CLIENT_SECRET,
      req.query.code,
      { redirect_uri: process.env.SLACK_CLIENT_OAUTH_REDIRECT_URI },
      (err, data) => {
        if (err = err || data.error) {
          console.log(errorMarker, err)
          res.redirect('/')
        } else {
          const attrs = {
            name: data.team_name,
            accessToken: data.bot.bot_access_token,
            responseBody: JSON.stringify(data),
          }

          Team.findOrCreate({
            where: { id: data.team_id }, defaults: Object.assign(attrs, { ownerId: data.user_id })
          }).spread(async (team, created) => {
            if (created) {
              enqueueNotifications(team.id)
            } else {
              let attrsForUpdate = attrs
              if (!team.ownerId) attrsForUpdate.ownerId = data.user_id
              await team.update(attrsForUpdate)
            }

            req.session.teamId = team.id
            res.redirect(`/${slugify(team.name)}/configuration`)
          })
        }
      }
    )
  } else {
    res.redirect('/')
  }
})

// config
//
router.get('/:teamName/configuration', checkTeamId, initTimeSetting, async (req, res, next) => {
  let team = await Team.findById(req.session.teamId)
  let timeSetting = await TimeSetting.find({ where: { teamId: team.id } })

  getChannels(team).then(channels => {
    res.render('configuration', {
      title: `Configure ${appName} integration`,
      team: { id: team.id, name: team.name, isAdmin: team.id === botTeamId },
      channels: channels,
      timeSetting: {
        tz: timeSetting.tz,
        startTime: timeSetting.startTime,
        endTime: timeSetting.endTime,
        days: timeSetting.days,
      }
    })
  }).catch(error => {
    res.status(500).json({ error: error })
  })
})

// static
//
router.get('/privacy', (req, res, next) => {
  res.render('privacy', { title: `${appName} Privacy Policy` })
})

router.get('/support', (req, res, next) => {
  res.render('support', {
    title: `${appName} Support`,
    slackButtonUrl: getSlackButtonUrl(),
    telegramButtonUrl: getTelegramButtonUrl(),
  })
})


export default router
