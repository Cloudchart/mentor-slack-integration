import url from 'url'
import request from 'request'

import { Router } from 'express'
import { WebClient } from 'slack-client'
import { Team, Channel } from '../models'
import { Theme, UserTheme, SlackChannel } from '../models/web_app'

let router = Router()
let SlackDefaultWeb = new WebClient('')


// helpers
//
let checkTeamId = (req, res, next) => {
  req.session.teamId ? next() : res.redirect('/')
}

let callWebAppGraphQL = (channelId, method, query) => {
  return new Promise((resolve, reject) => {
    let options = {
      url: process.env.GRAPHQL_SERVER_URL,
      method: method,
      qs: { query: query },
      headers: { 'X-Slack-Channel-Id': channelId },
    }

    request(options, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        console.log('Successfully called web app graphql server for channel:', channelId)
        resolve()
      } else {
        reject()
      }
    })
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
router.get('/channels', checkTeamId, async (req, res, next) => {
  let team = await Team.findById(req.session.teamId)
  let SlackWeb = new WebClient(team.accessToken)

  let teamChannels = await Channel.findAll({ where: { teamId: team.id } })
  let currentChannelIds = teamChannels.map(channel => channel.id)

  SlackWeb.channels.list((err, channels) => {
    if (err) {
      console.log('Error:', err)
      res.redirect('/')
    } else {
      res.render('channels', { team: team, channels: channels.channels, currentChannelIds: currentChannelIds })
    }
  })
})

router.post('/channels', checkTeamId, (req, res, next) => {
  let channelIds = req.body.channelIds
  if (!channelIds) return res.redirect('/channels')
  if (typeof channelIds === 'string') channelIds = [channelIds]

  let teamId = req.session.teamId

  // destroy all previously selected team channels
  Channel.destroy({ where: { teamId: teamId } })

  // create team channels
  // call web app graphql server to create users and user themes
  let requests = channelIds.reduce((promiseChain, id) => {
    return promiseChain.then(async () => {
      await Channel.findOrCreate({ where: { id: id }, defaults: { teamId: req.session.teamId } })
    }).then(async () => {
      await callWebAppGraphQL(id, 'GET', '{viewer{themes{edges{node{id}}}}}')
    })
  }, Promise.resolve())

  requests.then(() => res.redirect('/themes'))
})

// themes
//
router.get('/themes', checkTeamId, async (req, res, next) => {
  let team = await Team.findById(req.session.teamId)
  let SlackWeb = new WebClient(team.accessToken)

  let teamChannels = await Channel.findAll({ where: { teamId: team.id } })
  let currentChannelIds = teamChannels.map(channel => channel.id)

  let slackChannels = await SlackChannel.findAll({ where: { id: currentChannelIds } })
  let userIds = slackChannels.map(channel => channel.user_id)

  let userThemes = await UserTheme.findAll({ include: [ Theme ], where: { user_id: userIds } })
  userThemes = userThemes.sort((a, b) => a.Theme.name.localeCompare(b.Theme.name))

  SlackWeb.channels.list((err, channels) => {
    if (err) {
      console.log('Error:', err)
      res.redirect('/')
    } else {
      let reducedChannels = slackChannels.reduce((array, slackChannel) => {
        let object = channels.channels.find(channel => channel.id === slackChannel.id)
        object.themes = userThemes.filter(userTheme => userTheme.user_id === slackChannel.user_id)
        array.push(object)
        return array
      }, [])

      res.render('themes', { team: team, channels: reducedChannels })
    }
  })
})

router.post('/themes', checkTeamId, async (req, res, next) => {
  let body = req.body
  if (Object.keys(body).length === 0) return res.redirect('/themes')

  Object.keys(body).forEach(function(channelId) {
    let userThemesIds = body[channelId]
    if (typeof userThemesIds === 'string') userThemesIds = [userThemesIds]

    userThemesIds.forEach((id, index) => {
      callWebAppGraphQL(channelId, 'POST', `
        mutation m {
          subscribeOnTheme(input: {
            id: "${new Buffer(id).toString('base64')}",
            clientMutationId: "${index}"
          }) {
            themeID
          }
        }
      `)

    })
  })

  res.render('success')
})


export default router
