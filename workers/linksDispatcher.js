import moment from 'moment-timezone'
import { WebClient } from 'slack-client'
import { errorMarker } from '../lib'
import { checkIfBotIsInvited, getRandomLinkForSubscribedTopics, markLinkAsRead } from './helpers'
import { callWebAppGraphQL } from '../routes/helpers'
import { Channel, Team, TimeSetting } from '../models'

const workerName = 'linksDispatcher'


// helpers
//
function sendMessage(channelId, link, SlackWeb) {
  const text = `${link.reaction.content} <${link.url}|${link.title}>`

  const options = {
    as_user: true,
    unfurl_links: false,
    unfurl_media: false,
  }

  SlackWeb.chat.postMessage(channelId, text, options, async (err, res) => {
    if (err = err || res.error) {
      console.log(errorMarker, err, workerName, 'chat.postMessage')
    } else {
      markLinkAsRead(channelId, link.id)
      // TODO: send insights
    }
  })
}

// for each selected channel
// on start time of team time settings
// request links and insights for selected topics
// check if bot is invited to channel
// select random link and 3 random insights
// post messages to channel
// mark topic link as read
async function perform(done) {
  const channels = await Channel.findAll({ include: [{ model: Team, include: [TimeSetting] }] })

  const jobs = channels.reduce(async (promiseChain, channel) => {
    return promiseChain.then(async () => {
      const timeSetting = channel.Team.TimeSetting
      const now = moment().tz(timeSetting.tz)
      const time = now.format('HH:mm')
      // TODO: uncomment
      // if (time !== timeSetting.startTime) return

      const SlackWeb = new WebClient(channel.Team.accessToken)
      const isBotInvited = await checkIfBotIsInvited(channel.id, SlackWeb)
      if (!isBotInvited) return

      const link = await getRandomLinkForSubscribedTopics(channel.id)
      if (link) sendMessage(channel.id, link, SlackWeb)
    })
  }, Promise.resolve())

  jobs.then(() => done(null, true))
}


export { perform }
