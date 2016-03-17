import { Router } from 'express'
import { callWebAppGraphQL } from '../lib'
import { checkTeamId } from './checkers'

let router = Router()


router.get('/:channelId', checkTeamId, async (req, res, next) => {
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

router.patch('/', checkTeamId, async (req, res, next) => {
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
