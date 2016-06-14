import { combineReducers } from 'redux'

import survey from './survey'
import questions from './questions'
import results from './results'

export default combineReducers({
  survey,
  questions,
  results,
})
