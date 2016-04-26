export default function users(state = [], action) {
  switch (action.type) {
    case 'MESSAGES_RECEIVE':
      return state.map(user =>
        user.id === action.userId ?
        Object.assign({}, user, { hasNewMessage: false }) :
        user
      )
    default:
      return state
  }
}
