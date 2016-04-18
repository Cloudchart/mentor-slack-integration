import { combineReducers } from 'redux'

import team from './team'
import teams from './admin/teams'
import users from './admin/teamUsers'
import messages from './admin/teamMessages'

export default combineReducers({
  team,
  teams,
  users,
  messages,
})
