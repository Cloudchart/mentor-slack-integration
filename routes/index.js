import url from 'url'

import { Router } from 'express'
import { WebClient } from 'slack-client'

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
        // TODO: save data
        res.redirect('/channels')
      }
    )
  } else {
    res.redirect('/')
  }
})

router.get('/channels', (req, res, next) => {
  let SlackWeb = new WebClient('xoxb-21455534866-s0Gf8VACmiau7E4yOwzRC1IH')

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
      console.log(channels.channels);
      res.render('channels', { channels: channels.channels })
    }
  })
})

export default router
