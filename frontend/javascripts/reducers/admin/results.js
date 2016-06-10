export default function results(state = [], action) {
  switch (action.type) {
    case 'CREATE_RESULT_RECEIVE':
      return state.concat(action.result)
    case 'DESTROY_RESULT_RECEIVE':
      return state.filter(result => result.id !== action.id)
    case 'UPDATE_RESULT_RECEIVE':
      return state.map(result => result.id === action.id ?
        Object.assign(action.result, { isFetching: false }) :
        result
      )
    case 'UPDATE_RESULT_ERROR':
      return state.map(result => result.id === action.id ?
        Object.assign(result, { isFetching: false, error: action.error }) :
        result
      )
    case 'DESTROY_RESULT_RECEIVE':
      return state.filter(result => result.id !== action.id)
    default:
      return state
  }
}
