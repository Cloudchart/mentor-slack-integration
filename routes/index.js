import url from 'url'

import { Router } from 'express'
import { WebClient } from 'slack-client'
import { Team, Channel } from '../models'

let router = Router()
let SlackDefaultWeb = new WebClient('')


// auth
//
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
            req.session.teamId = team.id
            res.redirect('/channels')
          })
        }
      }
    )
  } else {
    res.redirect('/')
  }
})

// channels
//
router.get('/channels', async (req, res, next) => {
  if (!req.session.teamId) return res.redirect('/')

  let team = await Team.findById(req.session.teamId)
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
      res.render('channels', { team: team, channels: channels.channels })
    }
  })
})

router.post('/channels', (req, res, next) => {
  // TODO: make graphql request to mentor web app

  if (!req.session.teamId) return res.redirect('/')

  let channelIds = req.body.channelIds
  if (!channelIds) return res.redirect('/channels')
  if (typeof channelIds === 'string') channelIds = [channelIds]

  // TODO: redirect only after all channels have been created
  channelIds.forEach((id) => {
    Channel.findOrCreate({ where: { id: id }, defaults: { teamId: req.session.teamId } })
  })

  res.redirect('/themes')
})

// themes
//
router.get('/themes', async (req, res, next) => {
  // TODO: get themes from web app

  if (!req.session.teamId) return res.redirect('/')

  let team = await Team.findById(req.session.teamId)
  let SlackWeb = new WebClient(team.accessToken)

  let selectedChannels = await Channel.findAll({ where: { teamId: team.id } })
  let selectedChannelIds = selectedChannels.map((channel) => { return channel.id })

  SlackWeb.channels.list((err, channels) => {
    if (err) {
      console.log('Error:', err)
      res.redirect('/')
    } else {
      let filteredChannels = channels.channels.filter((channel) => { return selectedChannelIds.includes(channel.id) })
      res.render('themes', { team: team, channels: filteredChannels })
    }
  })
})


export default router
