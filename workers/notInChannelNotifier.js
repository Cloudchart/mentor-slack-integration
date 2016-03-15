import { WebClient } from 'slack-client'
import { errorMarker, getRandomElementFromArray, botName } from '../lib'
import { Channel, Team, TeamOwner, TeamOwnerNotification } from '../models'

const workerName = 'notInChannelNotifier'

const textOptions = [
  "Hello human. If you want me to work in your channel, then use this command:",
  "Hello Master. Use this command to make me fully operational in the channel you selected:",
  "Hey, to give you advice, I need to be invited to this channel:",
  "Hey! Use this command to invite me to the channel you selected and unleash my full power:"
]


// helpers
//
function sendMessage(SlackWeb, teamOwner, channelId, done) {
  // TODO: do nothing if bot is already invited to the channel
  // TODO: do nothing if owner has already received 2 messages of this type

  SlackWeb.channels.info(channelId, (err, res) => {
    if (err = err || res.error) {
      console.log(errorMarker, err, workerName, 'channels.info')
      done(null)
    } else {
      // generate text
      let text = []
      text.push(getRandomElementFromArray(textOptions))
      text.push(`/invite @${botName} #${res.channel.name}`)
      text = text.join(' ')

      SlackWeb.chat.postMessage(teamOwner.imId, text, { as_user: true }, (err, res) => {
        if (err = err || res.error) {
          console.log(errorMarker, err, workerName, 'chat.postMessage')
          done(null)
        } else {
          // TODO: leave trace of notification
          done(null, true)
        }
      })
    }
  })
}

// worker – notifies team owner if bot isn't invited to the channel
//
async function perform(channelId, done) {
  let channel = await Channel.find({ include: [Team], where: { id: channelId } })
  let SlackWeb = new WebClient(channel.Team.accessToken)
  let teamOwner = await TeamOwner.find({ where: { teamId: channel.Team.id } })

  // get data from db if we have sent notifications before
  if (teamOwner) {
    sendMessage(SlackWeb, teamOwner, channel.id, done)
  // otherwise get data from slack api
  } else {
    SlackWeb.users.list((err, res) => {
      if (err = err || res.error) {
        console.log(errorMarker, err, workerName, 'users.list')
        done(null)
      } else {
        // let teamOwner = res.members.find(member => member.is_primary_owner)
        let teamOwner = res.members.find(member => member.name === 'peresleguine')

        SlackWeb.dm.list((err, res) => {
          if (err = err || res.error) {
            console.log(errorMarker, err, workerName, 'im.list')
            done(null)
          } else {
            let im = res.ims.find(im => im.user === teamOwner.id)

            // save team owner for further notifications
            TeamOwner.findOrCreate({
              where: { id: im.user },
              defaults: { teamId: channel.Team.id, imId: im.id, responseBody: JSON.stringify(im) }
            }).spread((teamOwner, created) => {
              sendMessage(SlackWeb, teamOwner, channel.id, done)
            })

          }

        })
      }
    })
  }
}


export { perform }
