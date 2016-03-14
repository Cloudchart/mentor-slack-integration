const initialState = {
  isFetching: false,
  items: [],
}

export default function themes(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_THEME_STATUS_REQUEST':
      return Object.assign({}, state, {
        items: state.items.map(theme =>
          theme.id === action.id ?
            Object.assign({}, theme, { isFetching: true }) :
            theme
        )
      })
    case 'UPDATE_THEME_STATUS_RECEIVE':
      return Object.assign({}, state, {
        items: state.items.map(theme =>
          theme.id === action.id ?
            Object.assign({}, theme, { isFetching: false, isSubscribed: action.isSubscribed }) :
            theme
        )
      })
    case 'UPDATE_THEME_STATUS_ERROR':
      return Object.assign({}, state, {
        items: state.items.map(theme =>
          theme.id === action.id ?
            Object.assign({}, theme, { isFetching: false }) :
            theme
        )
      })
    case 'THEMES_REQUEST':
      return Object.assign({}, state, {
        isFetching: true,
      })
    case 'THEMES_RECEIVE':
      return Object.assign({}, state, {
        isFetching: false,
        items: action.themes,
        lastUpdated: action.receivedAt,
      })
    case 'THEMES_ERROR':
      return Object.assign({}, state, {
        isFetching: false,
      })
    default:
      return state
  }
}
