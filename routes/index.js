import URL from 'url'

import { Router } from 'express'
import { WebClient } from 'slack-client'
import { errorMarker, callWebAppGraphQL } from '../lib'

import { Team, Channel, TimeSetting } from '../models'

let router = Router()
let SlackDefaultWeb = new WebClient('')


// helpers
//
async function initTimeSetting(req, res, next) {
  // TODO: get tz from ip
  await TimeSetting.findOrCreate({
    where: { teamId: req.session.teamId },
    defaults: {
      tz: 'Europe/Moscow',
      startTime: '10:00',
      endTime: '22:00',
      days: ['mon', 'tue', 'wed', 'thu', 'fri']
    }
  })
  next()
}

function checkTeamId(req, res, next) {
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

  res.render('landing', { title: 'Add Virtual Mentor to Slack', slackButtonUrl: slackButtonUrl })
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
router.get('/configuration', checkTeamId, initTimeSetting, async (req, res, next) => {
  let team = await Team.findById(req.session.teamId)
  let SlackWeb = new WebClient(team.accessToken)

  let timeSetting = await TimeSetting.find({ where: { teamId: team.id } })
  let teamChannels = await Channel.findAll({ where: { teamId: team.id } })
  let selectedChannelIds = teamChannels.map(channel => channel.id)

  SlackWeb.channels.list(true, (err, data) => {
    if (err = err || data.error) {
      res.status(500).json({ error: err })
    } else {
      let channels = data.channels.map(channel => {
        let status = null
        if (selectedChannelIds.includes(channel.id)) {
          status = channel.is_member ? 'invited' : 'uninvited'
        }

        return {
          id: channel.id,
          name: channel.name,
          status: status,
        }
      })

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
    }
  })
})

// channels
//
router.post('/channels', checkTeamId, async (req, res, next) => {
  let id = req.body.id
  let team = await Team.findById(req.session.teamId)
  let selectedChannel = await Channel.findOrCreate({ where: { id: id }, defaults: { teamId: team.id } })
  if (!selectedChannel) return res.status(500).json({ message: 'something went wrong' })

  let SlackWeb = new WebClient(team.accessToken)

  SlackWeb.channels.info(id, (error, data) => {
    if (error = error || data.error) {
      res.status(500).json({ error: error })
    } else {
      res.status(201).json({ status: data.channel.is_member ? 'invited' : 'uninvited' })
    }
  })
})

router.delete('/channels', checkTeamId, async (req, res, next) => {
  let id = req.body.id
  let team = await Team.findById(req.session.teamId)
  await Channel.destroy({ where: { id: id } })
  let SlackWeb = new WebClient(team.accessToken)

  SlackWeb.channels.info(id, (error, data) => {
    if (error = error || data.error) {
      res.status(500).json({ error: error })
    } else {
      res.json({ status: null })
    }
  })
})

// themes
//
router.get('/themes/:channelId', checkTeamId, async (req, res, next) => {
  let channelId = req.params.channelId

  // get user themes from web app
  // this will also create user and user themes if they aren't present
  let themesRes = await callWebAppGraphQL(channelId, 'GET', `
    {
      viewer {
        themes {
          edges {
            node {
              id
              name
              isSubscribed
            }
          }
        }
      }
    }
  `)

  let viewer = JSON.parse(themesRes).data.viewer
  let themes = []
  if (viewer && viewer.themes) themes = viewer.themes.edges.map(edge => edge.node)

  res.json({ themes: themes })
})

router.patch('/themes', checkTeamId, async (req, res, next) => {
  let id = req.body.id
  let channelId = req.body.channelId
  let action = req.body.action
  let mutationName = action === 'subscribe' ? 'subscribeOnTheme' : 'unsubscribeFromTheme'

  callWebAppGraphQL(channelId, 'POST', `
    mutation m {
      ${mutationName}(input: {
        id: "${id}",
        clientMutationId: "1"
      }) {
        themeID
      }
    }
  `).then(data => {
    data = JSON.parse(data).data
    if (!data[mutationName]) return res.status(404).json({ message: 'not found' })
    res.json({ isSubscribed: action === 'subscribe' ? true : false })
  }).catch(error => res.status(500).json({ error: error }))
})


export default router
