import { combineReducers } from 'redux'

import survey from './survey'
import questions from './questions'
import userAnswers from './userAnswers'

export default combineReducers({
  survey,
  questions,
  userAnswers,
})
