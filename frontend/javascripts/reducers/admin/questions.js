export default function questions(state = [], action) {
  switch (action.type) {
    case 'CREATE_QUESTION_RECEIVE':
      return state.concat(action.question)
    case 'DESTROY_QUESTION_RECEIVE':
      return state.filter(question => question.id !== action.id)
    case 'UPDATE_QUESTION_RECEIVE':
      return state.map(question => question.id === action.id ?
        Object.assign(action.question, { isFetching: false }) :
        question
      )
    case 'UPDATE_QUESTION_ERROR':
      return state.map(question => question.id === action.id ?
        Object.assign(question, { isFetching: false, error: action.error }) :
        question
      )
    case 'DESTROY_QUESTION_RECEIVE':
      return state.filter(question => question.id !== action.id)

    default:
      return state
  }
}
