import { combineReducers } from 'redux'

import team from './team'
import teams from './admin/teams'
import users from './admin/teamsUsers'

export default combineReducers({
  team,
  teams,
  users,
})
