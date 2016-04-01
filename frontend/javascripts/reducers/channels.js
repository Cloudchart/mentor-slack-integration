const initialState = {
  isFetching: false,
  items: [],
  status: '',
}

export default function channels(state = initialState, action) {
  switch (action.type) {
    case 'CREATE_CHANNEL_REQUEST':
    case 'DESTROY_CHANNEL_REQUEST':
      return Object.assign({}, state, {
        items: state.items.map(channel =>
          channel.id === action.id ?
            Object.assign({}, channel, { isFetching: true }) :
            channel
        )
      })
    case 'CREATE_CHANNEL_ERROR':
    case 'DESTROY_CHANNEL_ERROR':
      return Object.assign({}, state, {
        items: state.items.map(channel =>
          channel.id === action.id ?
            Object.assign({}, channel, { isFetching: false }) :
            channel
        )
      })
    case 'CREATE_CHANNEL_RECEIVE':
    case 'DESTROY_CHANNEL_RECEIVE':
      return Object.assign({}, state, {
        items: state.items.map(channel =>
          channel.id === action.id ?
            Object.assign({}, channel, { isFetching: false, status: action.status }) :
            channel
        )
      })
    case 'CHANNELS_REQUEST':
      return Object.assign({}, state, {
        isFetching: true,
      })
    case 'CHANNELS_RECEIVE':
      return Object.assign({}, state, {
        isFetching: false,
        items: action.channels,
        status: action.status,
        lastUpdated: action.receivedAt,
      })
    case 'CHANNELS_ERROR':
      return Object.assign({}, state, {
        isFetching: false,
      })
    default:
      return state
  }
}
