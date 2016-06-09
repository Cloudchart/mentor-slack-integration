export default function answers(state = [], action) {
  switch (action.type) {
    case 'CREATE_ANSWER_RECEIVE':
      return state.concat(action.answer)
    case 'DESTROY_ANSWER_RECEIVE':
      return state.filter(answer => answer.id !== action.id)
    case 'UPDATE_ANSWER_RECEIVE':
      return state.map(answer => answer.id === action.id ?
        Object.assign(action.answer, { isFetching: false }) :
        answer
      )
    case 'UPDATE_ANSWER_ERROR':
      return state.map(answer => answer.id === action.id ?
        Object.assign(answer, { isFetching: false, error: action.error }) :
        answer
      )
    case 'DESTROY_ANSWER_RECEIVE':
      return state.filter(answer => answer.id !== action.id)
    default:
      return state
  }
}
