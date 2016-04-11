import { Router } from 'express'
import { checkTeamId, callWebAppGraphQL } from './helpers'

const router = Router()


router.get('/:channelId', checkTeamId, async (req, res, next) => {
  const channelId = req.params.channelId

  // get user themes from web app
  // this will also create user and user themes if they aren't present
  const themesRes = await callWebAppGraphQL(channelId, 'GET', `
    {
      viewer {
        topics {
          edges {
            node {
              id
              name
              isSubscribedByViewer
            }
          }
        }
      }
    }
  `)

  const themesEdges = JSON.parse(themesRes).data.viewer.topics.edges
  const themes = themesEdges.map(theme => {
    return { id: theme.node.id, name: theme.node.name, isSubscribed: theme.node.isSubscribedByViewer }
  })
  res.json({ themes: themes })
})

router.patch('/', checkTeamId, async (req, res, next) => {
  let id = req.body.id
  let channelId = req.body.channelId
  let action = req.body.action
  let mutationName = action === 'subscribe' ? 'subscribeOnTopic' : 'unsubscribeFromTopic'

  callWebAppGraphQL(channelId, 'POST', `
    mutation m {
      ${mutationName}(input: {
        topicID: "${id}",
        clientMutationId: "1"
      }) {
        topicID
      }
    }
  `).then(data => {
    data = JSON.parse(data).data
    if (!data[mutationName]) return res.status(404).json({ message: 'not found' })
    res.json({ isSubscribed: action === 'subscribe' ? true : false })
  }).catch(error => res.status(500).json({ error: error }))
})


export default router
