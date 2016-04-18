export default function teamUsers(state = [], action) {
  switch (action.type) {
    case 'TEAM_USERS_REQUEST':
      return state.find(item => item.teamId === action.teamId) ?
        state.map(item => item.teamId === action.teamId ?
          Object.assign({}, item, { isFetching: true }) :
          item) :
        [...state, { teamId: action.teamId, isFetching: true, items: [] }]
    case 'TEAM_USERS_RECEIVE':
      return state.map(item => item.teamId === action.teamId ?
        Object.assign({}, item, { isFetching: false, items: action.users }) :
        item
      )
    case 'TEAM_USERS_ERROR':
      return state.map(item => item.teamId === action.teamId ?
        Object.assign({}, item, { isFetching: false }) :
        item
      )
    default:
      return state
  }
}
