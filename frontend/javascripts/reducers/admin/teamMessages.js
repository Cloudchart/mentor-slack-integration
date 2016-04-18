export default function teamMessages(state = [], action) {
  switch (action.type) {
    case 'TEAM_MESSAGES_REQUEST':
      return state.find(item => item.teamId === action.teamId) ?
        state.map(item => item.teamId === action.teamId ?
          Object.assign({}, item, { isFetching: true }) :
          item) :
        [...state, { teamId: action.teamId, isFetching: true, items: [] }]
    case 'TEAM_MESSAGES_RECEIVE':
      return state.map(item => item.teamId === action.teamId ?
        Object.assign({}, item, { isFetching: false, items: action.messages }) :
        item
      )
    case 'TEAM_MESSAGES_ERROR':
      return state.map(item => item.teamId === action.teamId ?
        Object.assign({}, item, { isFetching: false }) :
        item
      )
    default:
      return state
  }
}
