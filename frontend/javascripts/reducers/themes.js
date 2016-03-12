const initialState = {
  isFetching: false,
  items: [],
}

export default function themes(state = initialState, action) {
  switch (action.type) {
    case 'REQUEST_THEMES':
      return Object.assign({}, state, {
        isFetching: true,
      })
    case 'RECEIVE_THEMES':
      return Object.assign({}, state, {
        isFetching: false,
        items: action.themes,
        lastUpdated: action.receivedAt,
      })
    case 'CATCH_THEMES_ERROR':
      return Object.assign({}, state, {
        isFetching: false,
      })
    default:
      return state
  }
}
