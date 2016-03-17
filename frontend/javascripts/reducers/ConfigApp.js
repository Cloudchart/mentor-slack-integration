import { combineReducers } from 'redux'

import team from './team'
import channels from './channels'
import themes from './themes'
import timeSetting from './timeSetting'

export default combineReducers({
  team,
  channels,
  themes,
  timeSetting,
})
