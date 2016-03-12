import { combineReducers } from 'redux'

import team from './team'
import channels from './channels'
import themes from './themes'

export default combineReducers({
  team,
  channels,
  themes,
})
