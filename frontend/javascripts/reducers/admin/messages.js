export default function messages(state = [], action) {
  switch (action.type) {
    case 'MESSAGES_REQUEST':
      return state.find(item => item.userId === action.userId) ?
        state.map(item => item.userId === action.userId ?
          Object.assign({}, item, { isFetching: true }) :
          item) :
        [...state, { userId: action.userId, isFetching: true, items: [] }]
    case 'MESSAGES_RECEIVE':
      return state.map(item => item.userId === action.userId ?
        Object.assign({}, item, { isFetching: false, items: action.messages }) :
        item
      )
    case 'MESSAGES_ERROR':
      return state.map(item => item.userId === action.userId ?
        Object.assign({}, item, { isFetching: false }) :
        item
      )
    default:
      return state
  }
}
