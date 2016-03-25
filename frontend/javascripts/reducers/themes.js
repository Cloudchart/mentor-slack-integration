export default function themes(state = [], action) {
  switch (action.type) {
    case 'UPDATE_THEME_STATUS_REQUEST':
      return state.map(item => item.channelId === action.channelId ?
        Object.assign({}, item, { items: item.items.map(theme => theme.id === action.id ?
          Object.assign({}, theme, { isFetching: true }) :
          theme)
        }) :
        item
      )
    case 'UPDATE_THEME_STATUS_RECEIVE':
      return state.map(item => item.channelId === action.channelId ?
        Object.assign({}, item, { items: item.items.map(theme => theme.id === action.id ?
          Object.assign({}, theme, { isFetching: false, isSubscribed: action.isSubscribed }) :
          theme)
        }) :
        item
      )
    case 'UPDATE_THEME_STATUS_ERROR':
      return state.map(item => item.channelId === action.channelId ?
        Object.assign({}, item, { items: item.items.map(theme => theme.id === action.id ?
          Object.assign({}, theme, { isFetching: false }) :
          theme)
        }) :
        item
      )
    case 'THEMES_REQUEST':
      return state.find(item => item.channelId === action.channelId) ?
        state.map(item => item.channelId === action.channelId ?
          Object.assign({}, item, { isFetching: true }) :
          item) :
        [...state, { channelId: action.channelId, isFetching: true, items: [] }]
    case 'THEMES_RECEIVE':
      return state.map(item => item.channelId === action.channelId ?
        Object.assign({}, item, { isFetching: false, items: action.themes }) :
        item
      )
    case 'THEMES_ERROR':
      return state.map(item => item.channelId === action.channelId ?
        Object.assign({}, item, { isFetching: false }) :
        item
      )
    default:
      return state
  }
}
