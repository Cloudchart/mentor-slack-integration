import { combineReducers } from 'redux'

import team from './team'
import surveys from './admin/surveys'
import questions from './admin/questions'
import answers from './admin/answers'
import results from './admin/results'

export default combineReducers({
  team,
  surveys,
  questions,
  answers,
  results,
})
