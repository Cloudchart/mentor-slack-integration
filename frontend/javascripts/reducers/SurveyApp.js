import { combineReducers } from 'redux'

import survey from './survey'
import questions from './questions'
import userAnswers from './userAnswers'
import correctAnswers from './correctAnswers'

export default combineReducers({
  survey,
  questions,
  userAnswers,
  correctAnswers,
})
