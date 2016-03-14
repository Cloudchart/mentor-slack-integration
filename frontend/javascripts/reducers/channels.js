export default function channels(state = [], action) {
  switch (action.type) {
    case 'CREATE_CHANNEL_REQUEST':
    case 'DESTROY_CHANNEL_REQUEST':
      return state.map(channel =>
        channel.id === action.id ?
          Object.assign({}, channel, { isFetching: true }) :
          channel
      )
    case 'CREATE_CHANNEL_ERROR':
    case 'DESTROY_CHANNEL_ERROR':
      return state.map(channel =>
        channel.id === action.id ?
          Object.assign({}, channel, { isFetching: false }) :
          channel
      )
    case 'CREATE_CHANNEL_RECEIVE':
    case 'DESTROY_CHANNEL_RECEIVE':
      return state.map(channel =>
        channel.id === action.id ?
          Object.assign({}, channel, { isFetching: false, status: action.status }) :
          channel
      )
    default:
      return state
  }
}
