import { WebClient } from 'slack-client'
import { toSentence } from 'underscore.string'

import { errorMarker } from '../lib'
import { callWebAppGraphQL } from '../routes/helpers'
import { Channel, ChannelNotification, Team } from '../models'

const workerName = 'channelThemesChangeNotifier'
const notificationType = 'themes_changed'


// helpers
//
function getSubscribedThemes(channelId) {
  return new Promise(async (resolve, reject) => {
    const themesRes = await callWebAppGraphQL(channelId, 'GET', `
      {
        viewer {
          themes {
            edges {
              node {
                name
                isSubscribed
              }
            }
          }
        }
      }
    `)

    const viewer = JSON.parse(themesRes).data.viewer
    let themes = []

    if (viewer && viewer.themes) {
      themes = viewer.themes.edges.map(edge => edge.node)
      themes = themes.filter(theme => theme.isSubscribed)
      themes = themes.map(theme => theme.name)
    }

    resolve(themes)
  })
}

async function sendMessage(channel, themes, done) {
  const channelNotification = await ChannelNotification.find({ where: { channelId: channel.id } })
  const SlackWeb = new WebClient(channel.Team.accessToken)
  let text

  if (channelNotification) {
    text = `New settings accepted. I will now give you advice on ${toSentence(themes)} in this channel.`
  } else {
    const pt1 = `Greetings, humans. I am your Virtual Mentor, here to give you advice on ${toSentence(themes)} in this channel. You can always change that in my settings.`
    const pt2 = "Please use reactions on my advices so I can adjust my setup and serve you better. Now let the mentoring begin!"
    text = [pt1, pt2].join('\n')
  }

  SlackWeb.chat.postMessage(channel.id, text, { as_user: true }, async (err, res) => {
    if (err = err || res.error) {
      console.log(errorMarker, err, workerName, 'chat.postMessage')
      done(null)
    } else {
      // leave trace of notification
      await ChannelNotification.create({
        channelId: channel.id,
        type: notificationType
      })

      done(null, true)
    }
  })
}

// worker – notifies channel if themes were changed
//
async function perform(channelId, done) {
  const channel = await Channel.findOne({ include: [Team], where: { id: channelId } })
  if (!channel) return done(null)

  const themes = await getSubscribedThemes(channel.id)
  if (themes.length === 0) return done(null)

  sendMessage(channel, themes, done)
}


export { perform }
