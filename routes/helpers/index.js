import request from 'request'
import Redis from 'ioredis'
import NR from 'node-resque'

const RedisClient = new Redis(process.env.REDIS_URL)


export const Queue = new NR.queue({ connection: { redis: RedisClient } })

export function checkTeamId(req, res, next) {
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

export function callWebAppGraphQL(channelId, method, query) {
  return new Promise((resolve, reject) => {
    let options = {
      url: process.env.GRAPHQL_SERVER_URL,
      method: method,
      qs: { query: query },
      headers: { 'X-Slack-Channel-Id': channelId },
    }

    request(options, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        // console.log('Successfully called web app graphql server for channel:', channelId)
        resolve(body)
      } else {
        reject()
      }
    })
  })
}