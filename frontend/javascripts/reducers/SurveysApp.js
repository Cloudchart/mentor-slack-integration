import { combineReducers } from 'redux'

import team from './team'
import surveys from './admin/surveys'
import questions from './admin/questions'

export default combineReducers({
  team,
  surveys,
  questions,
})
