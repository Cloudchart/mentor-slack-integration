import { combineReducers } from 'redux'

import team from './team'
import viewedTeam from './admin/viewedTeam'
import users from './admin/users'

export default combineReducers({
  team,
  viewedTeam,
  users,
})
