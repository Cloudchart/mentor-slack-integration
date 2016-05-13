import { combineReducers } from 'redux'

import team from './team'
import channels from './channels'
import themes from './themes'
import viewedTeam from './admin/viewedTeam'
import users from './admin/users'
import messages from './admin/messages'

export default combineReducers({
  team,
  viewedTeam,
  users,
  channels,
  themes,
  messages,
})
