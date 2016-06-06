import { combineReducers } from 'redux'

import team from './team'
import surveys from './admin/surveys'

export default combineReducers({
  team,
  surveys,
})
