import { queue } from '../../node-resque'
import { sample, sampleSize } from 'lodash'
import { WebClient } from 'slack-client'
import { eventMarker, errorMarker } from '../../lib'
import { callWebAppGraphQL } from '../../routes/helpers'
import { TeamOwner, User } from '../../models'


export function enqueue(name, payload) {
  return new Promise((resolve, reject) => {
    queue.enqueue('slack-integration', name, payload, () => {
      console.log(eventMarker, 'enqueued', name)
      resolve()
    })
  })
}

export function enqueueIn(delay, name, payload) {
  return new Promise((resolve, reject) => {
    queue.enqueueIn(delay, 'slack-integration', name, payload, () => {
      console.log(eventMarker, 'enqueued', name)
      resolve()
    })
  })
}

export async function getTeamOwner(teamId, SlackWeb) {
  return new Promise(async (resolve, reject) => {
    let teamOwner = await TeamOwner.findOne({ where: { teamId: teamId } })

    if (teamOwner) {
      resolve(teamOwner)
    } else {
      SlackWeb.users.list((err, res) => {
        if (err = err || res.error) {
          console.log(errorMarker, err, 'getTeamOwner', 'users.list')
          resolve(null)
        } else {
          let primaryOwner = res.members.find(member => member.is_primary_owner)
          // let primaryOwner = res.members.find(member => member.name === 'peresleguine')

          SlackWeb.dm.list((err, res) => {
            if (err = err || res.error) {
              console.log(errorMarker, err, 'getTeamOwner', 'im.list')
              resolve(null)
            } else {
              let im = res.ims.find(im => im.user === primaryOwner.id)
              if (!im) return resolve(null)

              TeamOwner.findOrCreate({
                where: { id: im.user },
                defaults: { teamId: teamId, imId: im.id, responseBody: JSON.stringify(im) }
              }).spread((teamOwner, created) => {
                resolve(teamOwner)
              })
            }

          })
        }
      })
    }

  })
}

export function getAndSyncUsers(team) {
  return new Promise((resolve, reject) => {
    const SlackWeb = new WebClient(team.accessToken)

    SlackWeb.users.list((err, res) => {
      if (err = err || res.error) {
        console.log(errorMarker, 'getAndSyncUsers', 'users.list', err)
        resolve([])
      } else {
        const users = res.members.filter(member => {
          return (
            !member.deleted && !member.is_restricted && !member.is_ultra_restricted &&
            !member.is_bot && member.name !== 'slackbot'
          )
        })

        resolve(users)

        SlackWeb.dm.list((err, res) => {
          if (err = err || res.error) {
            console.log(errorMarker, 'getAndSyncUsers', 'dm.list', err)
          } else {
            users.forEach(user => {
              const im = res.ims.find(im => im.user === user.id)
              if (!im) return

              const attrs = {
                teamId: team.id,
                imId: im.id,
                responseBody: JSON.stringify(user),
              }

              User.findOrCreate({
                where: { id: user.id }, defaults: attrs
              }).spread((user, created) => {
                if (!created) user.update(attrs)
              })
            })
          }
        })
      }
    })
  })
}

export function reactOnInsight(rate, channelId, topicId, insightId) {
  return new Promise(async (resolve, reject) => {
    const mutationName = rate === 1 ? 'likeInsightInTopic' : 'dislikeInsightInTopic'
    const response = await callWebAppGraphQL(channelId, 'POST', `
      mutation m {
        ${mutationName}(input: {
          topicID: "${topicId}"
          insightID: "${insightId}"
          clientMutationId: "1"
        }) {
          insightID
        }
      }
    `)

    resolve(response)
  })
}

export function markInsightAsRead(channelId, topicId, insightId) {
  return new Promise(async (resolve, reject) => {
    const response = await callWebAppGraphQL(channelId, 'POST', `
      mutation m {
        postponeInsightInTopic(input: {
          topicID: "${topicId}"
          insightID: "${insightId}"
          clientMutationId: "1"
        }) {
          insightID
        }
      }
    `)

    resolve(response)
  })
}

export function markLinkAsRead(channelId, linkId) {
  return new Promise(async (resolve, reject) => {
    const response = await callWebAppGraphQL(channelId, 'POST', `
      mutation m {
       markTopicLinkAsRead(input: {
         topicLinkID: "${linkId}"
         clientMutationId: "1"
       }) {
         topicLinkID
       }
      }
    `)

    resolve(response)
  })
}

export function getAllUnratedInsights(channelId) {
  return new Promise(async (resolve, reject) => {
    const response = await callWebAppGraphQL(channelId, 'GET', `
      {
        viewer {
          insights {
            edges {
              topic {
                id
                name
              }
              node {
                id
                content
                origin {
                  author
                  url
                  title
                  duration
                }
              }
            }
          }
        }
      }
    `)

    if (!response) return resolve(null)

    try {
      const insights = JSON.parse(response).data.viewer.insights.edges
      if (insights.length > 0) {
        resolve(insights.map(insight => {
          return { insight: insight.node, topic: insight.topic }
        }))
      } else {
        resolve(null)
      }
    } catch (err) {
      console.log(errorMarker, 'getAllUnratedInsights', err)
      resolve(false)
    }
  })
}

export function getRandomUnratedInsight(channelId) {
  return new Promise(async (resolve, reject) => {
    const response = await callWebAppGraphQL(channelId, 'GET', `
      {
        viewer {
          insights {
            edges {
              topic {
                id
                name
              }
              node {
                id
                content
                origin {
                  author
                  url
                  title
                  duration
                }
              }
            }
          }
        }
      }
    `)

    if (!response) return resolve(null)

    try {
      const insights = JSON.parse(response).data.viewer.insights.edges
      if (insights.length > 0) {
        const randomInsight = sample(insights)
        resolve({ insight: randomInsight.node, topic: randomInsight.topic })
      } else {
        resolve(null)
      }
    } catch (err) {
      console.log(errorMarker, 'getRandomUnratedInsight', err)
      resolve(false)
    }
  })
}

export function getRandomSubscribedTopic(channelId) {
  return new Promise(async (resolve, reject) => {
    const response = await callWebAppGraphQL(channelId, 'GET', `
      {
        viewer {
          topics(filter: SUBSCRIBED) {
            edges {
              node {
                id
                name
                links(filter: UNREAD) {
                  edges {
                    node {
                      id
                      url
                      title
                      reaction {
                        id
                        mood
                        content
                      }
                      insights {
                        edges {
                          node {
                            id
                            content
                            origin {
                              author
                              url
                              title
                              duration
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `)

    if (!response) return resolve(null)

    try {
      const topics = JSON.parse(response).data.viewer.topics.edges
      let topic = sample(topics.filter(topic => topic.node.links.edges.length > 0))

      if (topic) {
        topic = topic.node
        topic.randomLink = sample(topic.links.edges).node
        topic.randomInsights = sampleSize(topic.randomLink.insights.edges.map(edge => edge.node), 3)
        resolve(topic)
      } else {
        resolve(null)
      }
    } catch (err) {
      console.log(errorMarker, 'getRandomSubscribedTopic', err)
      resolve(false)
    }
  })
}

export function getSubscribedThemes(channelId) {
  return new Promise(async (resolve, reject) => {
    const response = await callWebAppGraphQL(channelId, 'GET', `
      {
        viewer {
          topics(filter: SUBSCRIBED) {
            edges {
              node {
                name
              }
            }
          }
        }
      }
    `)

    if (!response) return resolve([])

    const topics = JSON.parse(response).data.viewer.topics.edges
    resolve(topics.map(topic => topic.node.name))
  })
}
