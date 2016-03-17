export default function timeSetting(state = {}, action) {
  switch (action.type) {
    case 'UPDATE_TIME_SETTING_REQUEST':
      return Object.assign({}, state, {
        isFetching: true,
        [action.attr]: action.value,
      })
    case 'UPDATE_TIME_SETTING_RECEIVE':
      return Object.assign({}, state, {
        isFetching: false,
        [action.attr]: action.value,
      })
    case 'UPDATE_TIME_SETTING_ERROR':
      return Object.assign({}, state, {
        isFetching: false,
        [action.attr]: action.value,
        error: action.error,
      })
    default:
      return state
  }
}
