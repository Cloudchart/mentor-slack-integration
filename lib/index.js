import request from 'request'


// constants
//
export const eventMarker = '>>>'
export const errorMarker = 'Error:'
export const oneDayInSeconds = 86400

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
        console.log('Successfully called web app graphql server for channel:', channelId)
        resolve()
      } else {
        reject()
      }
    })
  })
}