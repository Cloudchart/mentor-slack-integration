import { combineReducers } from 'redux'

import team from './team'
import viewedTeam from './admin/viewedTeam'
import users from './admin/teamUsers'

export default combineReducers({
  team,
  viewedTeam,
  users,
})
