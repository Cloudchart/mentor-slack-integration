import { combineReducers } from 'redux'

import team from './team'
import teams from './admin/teams'

export default combineReducers({
  team,
  teams,
})
