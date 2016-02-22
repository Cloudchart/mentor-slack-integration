import url from 'url'
import request from 'request'

import { Router } from 'express'
import { WebClient } from 'slack-client'
import { Team, Channel } from '../models'
import { Theme } from '../models/web_app'

let router = Router()
let SlackDefaultWeb = new WebClient('')


// helpers
//
let callWebAppGraphQL = (channelId) => {
  let options = {
    url: process.env.GRAPHQL_SERVER_URL,
    qs: { query: '{viewer{id}}' },
    headers: { 'X-Slack-Channel-Id': channelId },
  }

  request(options, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      console.log('Successfully called web app graphql server for channel:', channelId)
    }
  })
}

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
  let teamId = req.session.teamId
  if (!teamId) return res.redirect('/')

  let channelIds = req.body.channelIds
  if (!channelIds) return res.redirect('/channels')
  if (typeof channelIds === 'string') channelIds = [channelIds]

  // make requests to web app graphql server and create channels
  let requests = channelIds.reduce((promiseChain, id) => {
    callWebAppGraphQL(id)

    return promiseChain.then(() => {
      return Channel.findOrCreate({ where: { id: id }, defaults: { teamId: teamId } })
    })
  }, Promise.resolve())

  requests.then(() => res.redirect('/themes'))
})

// themes
//
router.get('/themes', async (req, res, next) => {
  let teamId = req.session.teamId
  if (!teamId) return res.redirect('/')

  let team = await Team.findById(teamId)
  let SlackWeb = new WebClient(team.accessToken)

  let selectedChannels = await Channel.findAll({ where: { teamId: team.id } })
  let selectedChannelIds = selectedChannels.map((channel) => channel.id)

  let themes = await Theme.findAll({ where: { is_default: true } })

  SlackWeb.channels.list((err, channels) => {
    if (err) {
      console.log('Error:', err)
      res.redirect('/')
    } else {
      let filteredChannels = channels.channels.filter((channel) => selectedChannelIds.includes(channel.id))
      res.render('themes', { team: team, channels: filteredChannels, themes: themes })
    }
  })
})

router.post('/themes', async (req, res, next) => {
  console.log(req.body);
  res.redirect('/themes')
})


export default router
