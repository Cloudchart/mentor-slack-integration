import request from 'request'

// constants
//
export const botName = 'boris'

export const eventMarker = '>>>'
export const errorMarker = 'Error:'

export const oneDayInSeconds = 86400
export const reactionsCollectorDelay = 20000
export const notInChannelNotifierDelay = 1000

export const daysOfWeek = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

export const dayTimes = [
 '00:00','01:00','02:00','03:00','04:00',
 '05:00','06:00','07:00','08:00','09:00',
 '10:00','11:00','12:00','13:00','14:00',
 '15:00','16:00','17:00','18:00','19:00',
 '20:00','21:00','22:00','23:00','24:00'
]

// helpers
//
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

// utils
//
export function getRandomElementFromArray(array) {
  return array[Math.floor(Math.random() * array.length)]
}
