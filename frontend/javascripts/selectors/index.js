import { createSelector } from 'reselect'
import { dayTimes } from '../../data'

const getEndTime = (state) => state.timeSetting.endTime
const getStartTime = (state) => state.timeSetting.startTime

export const getStartTimeRange = createSelector(
  [ getEndTime ], endTime => dayTimes.filter(time => time < endTime)
)

export const getEndTimeRange = createSelector(
  [ getStartTime ], startTime => dayTimes.filter(time => time > startTime)
)
