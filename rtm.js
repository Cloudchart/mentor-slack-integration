// var WebClient = require('slack-client').WebClient
var RtmClient = require('slack-client').RtmClient
var RTM_EVENTS = require('slack-client').RTM_EVENTS
var CLIENT_EVENTS = require('slack-client').CLIENT_EVENTS

var token = process.argv[2]
var rtm = new RtmClient(token, { logLevel: 'info' })
rtm.start()

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`)
})

rtm.on(RTM_EVENTS.MESSAGE, function (message) {
  // Listens to all `message` events from the team
  console.log('@@@', message)
})

// rtm.on(RTM_EVENTS.CHANNEL_CREATED, function (message) {
//   // Listens to all `channel_created` events from the team
// });
