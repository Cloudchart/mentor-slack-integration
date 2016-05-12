// constants
//
export const appName = 'MentorBot'
export const botName = 'mentorbot'
export const botTeamId = 'T02BZ68QC'

export const eventMarker = '>>>'
export const errorMarker = '[!] Error:'
export const noticeMarker = '^_^'

export const dispatcherTic = '0 * * * *'
export const statsDispatcherTic = '0 6 * * *'
export const usersSynchronizerTic = '15 * * * *'
export const messagesMonitorTic = '30 * * * *'
export const oneDayInMilliseconds = 86400000
export const maxWorkerAge = 900000
export const notInChannelNotifierDelay = oneDayInMilliseconds
export const channelReactionsNotifierDelay = 2700000
export const reactionsDispatcherDelay = 300000

export const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const dayTimes = [
 '00:00','01:00','02:00','03:00','04:00',
 '05:00','06:00','07:00','08:00','09:00',
 '10:00','11:00','12:00','13:00','14:00',
 '15:00','16:00','17:00','18:00','19:00',
 '20:00','21:00','22:00','23:00','24:00'
]

// utils
//
function isValidURL(string) {
  return /^s?https?:\/\/[-_.!~*'()a-zA-Z0-9;\/?:\@&=+\$,%#]+$/g.test(string)
}
