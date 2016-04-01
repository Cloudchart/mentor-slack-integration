// constants
//
export const botName = 'mentorbot'

export const eventMarker = '>>>'
export const errorMarker = '[!] Error:'
export const noticeMarker = '^_^'

export const senderTicInMin = 15
export const oneDayInSeconds = 86400
export const maxWorkerAge = 5000
export const reactionsCollectorDelay = oneDayInSeconds
export const notInChannelNotifierDelay = oneDayInSeconds

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
export function getRandomElementFromArray(array) {
  return array[Math.floor(Math.random() * array.length)]
}
