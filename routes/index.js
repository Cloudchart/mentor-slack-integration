import url from 'url'

import { Router } from 'express'
import { WebClient } from 'slack-client'
import { Team } from '../models'

let router = Router()
let SlackDefaultWeb = new WebClient('')


router.get('/', (req, res, next) => {
  let slackButtonUrl = url.format({
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

  res.render('index', { slackButtonUrl: slackButtonUrl })
})

router.get('/oauth/callback', (req, res, next) => {
  if (req.query.state === process.env.SLACK_CLIENT_OAUTH_STATE) {
    SlackDefaultWeb.oauth.access(
      process.env.SLACK_CLIENT_ID,
      process.env.SLACK_CLIENT_SECRET,
      req.query.code,
      {},
      (err, data) => {
        if (err) {
          console.log('Error:', err)
          res.redirect('/')
        } else {
          Team.findOrCreate({ where: { id: data.team_id }, defaults: {
            name: data.team_name,
            accessToken: data.bot.bot_access_token,
            responseBody: JSON.stringify(data),
          } }).spread((team, created) => {
            res.redirect('/channels')
          })
        }
      }
    )
  } else {
    res.redirect('/')
  }
})

router.get('/channels', async (req, res, next) => {
  let team = await Team.findOne({ where: { name: 'Insights.VC' } })
  let SlackWeb = new WebClient(team.accessToken)

  // SlackWeb.chat.postMessage('C04BXJQ77', 'khhh... mic check', { as_user: true }, (err, data) => {
  //   if (err) {
  //     console.log('Error:', err)
  //   } else {
  //     console.log(data);
  //   }
  // })

  SlackWeb.channels.list((err, channels) => {
    if (err) {
      console.log('Error:', err)
      res.redirect('/')
    } else {
      // console.log(channels.channels);
      res.render('channels', { channels: channels.channels })
    }
  })
})

export default router
