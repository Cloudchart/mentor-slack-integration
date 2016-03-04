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
  req.session.teamId ? next() : res.redirect('/')
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

  res.render('index', { slackButtonUrl: slackButtonUrl })
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

  res.format({
    html: () => {
      res.render('channels', { teamName: team.name })
    },

    json: async () => {
      let SlackWeb = new WebClient(team.accessToken)

      let teamChannels = await Channel.findAll({ where: { teamId: team.id } })
      let selectedChannelIds = teamChannels.map(channel => channel.id)

      SlackWeb.channels.list((err, data) => {
        if (err = err || data.error) {
          res.status(500).json({ error: err })
        } else {
          let channels = data.channels.map(channel => {
            return { id: channel.id, name: channel.name }
          })
          res.json({ channels: channels, selectedChannelIds: selectedChannelIds  })
        }
      })
    }
  })

})

router.post('/channels', checkTeamId, async (req, res, next) => {
  let channelIds = req.body.channelIds
  if (!channelIds) return res.redirect('/channels')
  if (typeof channelIds === 'string') channelIds = [channelIds]

  let teamId = req.session.teamId

  // destroy all previously selected team channels
  await Channel.destroy({ where: { teamId: teamId } })

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

  console.log(req.query);

  SlackWeb.channels.info(req.query.channelId, (err, data) => {
    if (err = err || data.error) {
      console.log(err);
      // TODO: handle error
    } else {
      res.render('themes', { channel: data.channel })
    }
  })



  // let team = await Team.findById(req.session.teamId)
  // let SlackWeb = new WebClient(team.accessToken)

  // let teamChannels = await Channel.findAll({ where: { teamId: team.id } })
  // let currentChannelIds = teamChannels.map(channel => channel.id)

  // let slackChannels = await SlackChannel.findAll({ where: { id: currentChannelIds } })
  // let userIds = slackChannels.map(channel => channel.user_id)

  // let userThemes = await UserTheme.findAll({ include: [Theme], where: { user_id: userIds } })
  // userThemes = userThemes.sort((a, b) => a.Theme.name.localeCompare(b.Theme.name))

  // SlackWeb.channels.list((err, channels) => {
  //   if (err) {
  //     console.log(errorMarker, err)
  //     res.redirect('/')
  //   } else {
  //     let reducedChannels = slackChannels.reduce((array, slackChannel) => {
  //       let object = channels.channels.find(channel => channel.id === slackChannel.id)
  //       object.themes = userThemes.filter(userTheme => userTheme.user_id === slackChannel.user_id)
  //       array.push(object)
  //       return array
  //     }, [])

  //     res.render('themes', { team: team, channels: reducedChannels })
  //   }
  // })
})

router.post('/themes', checkTeamId, async (req, res, next) => {
  let channelId = req.body.channelId
  let userThemeId = req.body.userThemeId
  let checked = req.body.checked
  let mutationName

  if (checked === 'true') {
    mutationName = 'subscribeOnTheme'
  } else if (checked === 'false') {
    mutationName = 'unsubscribeFromTheme'
  } else {
    return res.status(400).json({ error: 'bad request' })
  }

  callWebAppGraphQL(channelId, 'POST', `
    mutation m {
      ${mutationName}(input: {
        id: "${new Buffer(userThemeId).toString('base64')}",
        clientMutationId: "1"
      }) {
        themeID
      }
    }
  `).then(() => {
    res.json('ok')
  }).catch(() => {
    res.status(500).json('something went wrong')
  })
})

// success
//
router.get('/success', (req, res, next) => {
  res.render('success')
})


export default router
