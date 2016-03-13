const initialState = {
  isFetching: false,
  items: [],
}

export default function themes(state = initialState, action) {
  switch (action.type) {
    case 'REQUEST_UPDATE_THEME_STATUS':
      return Object.assign({}, state, {
        items: state.items.map(theme =>
          theme.id === action.id ?
            Object.assign({}, theme, { isFetching: true }) :
            theme
        )
      })
    case 'RECEIVE_UPDATE_THEME_STATUS':
      return Object.assign({}, state, {
        items: state.items.map(theme =>
          theme.id === action.id ?
            Object.assign({}, theme, { isFetching: false, isSubscribed: action.isSubscribed }) :
            theme
        )
      })
    case 'CATCH_UPDATE_THEME_STATUS_ERROR':
      return Object.assign({}, state, {
        items: state.items.map(theme =>
          theme.id === action.id ?
            Object.assign({}, theme, { isFetching: false }) :
            theme
        )
      })
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
