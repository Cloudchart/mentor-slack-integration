import URL from 'url'
// import moment from 'moment-timezone'

import { Router } from 'express'
import { WebClient } from 'slack-client'

import { errorMarker } from '../lib'
import { checkTeamId } from './checkers'
import { getChannels } from './channels'
import { Team, Channel, TimeSetting } from '../models'

let router = Router()
let SlackDefaultWeb = new WebClient('')


// helpers
//
async function initTimeSetting(req, res, next) {
  // TODO: get tz from moment-timezone
  // TODO: update timezones.json to tz database 2016b version
  await TimeSetting.findOrCreate({
    where: { teamId: req.session.teamId },
    defaults: {
      tz: 'Europe/Moscow',
      startTime: '10:00',
      endTime: '22:00',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    }
  })
  next()
}

// auth
//
router.get('/', (req, res, next) => {
  let slackButtonUrl = URL.format({
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

  res.render('landing', { title: 'Add Virtual Mentor to Slack', slackButtonUrl: slackButtonUrl })
})

router.get('/logout', (req, res, next) => {
  req.session.teamId = null
  res.redirect('/')
})

router.get('/oauth/callback', (req, res, next) => {
  if (req.query.state === process.env.SLACK_CLIENT_OAUTH_STATE) {
    SlackDefaultWeb.oauth.access(
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
            where: { id: data.team_id }, defaults: attrs
          }).spread(async (team, created) => {
            if (!created) await team.update(attrs)
            req.session.teamId = team.id
            res.redirect('/configuration')
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
router.get('/configuration', checkTeamId, initTimeSetting, async (req, res, next) => {
  let team = await Team.findById(req.session.teamId)
  let timeSetting = await TimeSetting.find({ where: { teamId: team.id } })

  getChannels(team).then(channels => {
    res.render('configuration', {
      title: 'Configure Virtual Mentor integration',
      team: { name: team.name },
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


export default router
