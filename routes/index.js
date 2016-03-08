import URL from 'url'

import { Router } from 'express'
import { WebClient } from 'slack-client'
import { errorMarker, callWebAppGraphQL } from '../lib'

import { Team, Channel } from '../models'
import { Theme, UserTheme, SlackChannel } from '../models/web_app'

let router = Router()
let SlackDefaultWeb = new WebClient('')


// helpers
//
let checkTeamId = (req, res, next) => {
  if (req.session.teamId) {
    next()
  } else {
    res.format({
      html: () => {
        res.redirect('/')
      },

      json: function(){
        res.status(401).json({ message: 'you are not authenticated' })
      }
    })
  }
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

  res.render('landing', { slackButtonUrl: slackButtonUrl })
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
          Team.findOrCreate({ where: { id: data.team_id }, defaults: {
            name: data.team_name,
            accessToken: data.bot.bot_access_token,
            responseBody: JSON.stringify(data),
          } }).spread((team, created) => {
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
router.get('/configuration', checkTeamId, async (req, res, next) => {
  let team = await Team.findById(req.session.teamId)
  res.render('configuration', { teamName: team.name })
})

// channels
//
router.get('/channels', checkTeamId, async (req, res, next) => {
  let team = await Team.findById(req.session.teamId)
  let SlackWeb = new WebClient(team.accessToken)

  let teamChannels = await Channel.findAll({ where: { teamId: team.id } })
  let selectedChannelIds = teamChannels.map(channel => channel.id)

  SlackWeb.channels.list(true, (err, data) => {
    if (err = err || data.error) {
      res.status(500).json({ error: err })
    } else {
      let channels = data.channels.map(channel => {
        let status
        if (selectedChannelIds.includes(channel.id)) {
          status = channel.is_member ? 'invited' : 'uninvited'
        }

        return {
          id: channel.id,
          name: channel.name,
          status: status,
        }
      })
      res.json({ channels: channels })
    }
  })
})

// themes
//
router.get('/themes', checkTeamId, async (req, res, next) => {
  let channelId = req.query.channelId

  // call web app graphql server to create users and user themes
  await callWebAppGraphQL(channelId, 'GET', '{viewer{themes{edges{node{id}}}}}')

  // get slack channel from web app
  let slackChannel = await SlackChannel.findById(channelId)

  // get user themes from web app
  let userThemes = await UserTheme.findAll({ include: [Theme], where: { user_id: slackChannel.user_id } })
  userThemes = userThemes.map(userTheme => {
    return { id: userTheme.id, name: userTheme.Theme.name, status: userTheme.status }
  })
  userThemes = userThemes.sort((a, b) => a.name.localeCompare(b.name))

  res.json({ themes: userThemes })
})

router.post('/themes', checkTeamId, async (req, res, next) => {
  let teamId = req.session.teamId
  let channelId = req.body.channelId
  let userThemeId = req.body.userThemeId
  let status = req.body.status
  let selectedThemesSize = req.body.selectedThemesSize
  let mutationName = status === 'subscribed' ? 'subscribeOnTheme' : 'unsubscribeFromTheme'

  callWebAppGraphQL(channelId, 'POST', `
    mutation m {
      ${mutationName}(input: {
        id: "${new Buffer(userThemeId).toString('base64')}",
        clientMutationId: "1"
      }) {
        themeID
      }
    }
  `).then(async (data) => {
    if (selectedThemesSize === 1 && status === 'subscribed') {
      Channel.findOrCreate({ where: { id: channelId }, defaults: { teamId: teamId } })
    } else if (selectedThemesSize === 0 && status === 'visible') {
      Channel.destroy({ where: { id: channelId } })
    }

    res.json('ok')
  }).catch(() => {
    res.status(500).json('something went wrong')
  })
})


export default router
