import fetch from 'isomorphic-fetch'


function requestTeamChat(teamId) {
  return {
    type: 'TEAM_CHAT_REQUEST',
    teamId: teamId,
  }
}

function receiveTeamChat(teamId, json) {
  return {
    type: 'TEAM_CHAT_RECEIVE',
    teamId: teamId,
    users: json.users,
    messages: json.messages,
  }
}

function catchTeamChatError(teamId, error) {
  return {
    type: 'TEAM_CHAT_ERROR',
    teamId: teamId,
    error: error,
  }
}

function fetchTeamChat(teamId) {
  return function (dispatch) {
    dispatch(requestTeamChat(teamId))

    return fetch(`/admin/teams/chat/${teamId}`, {
      credentials: 'same-origin',
      headers: { 'Accept': 'application/json' },
    }).then(response => response.json()).then(json => {
      return dispatch(receiveTeamChat(teamId, json))
    }).catch(error => {
      return dispatch(catchTeamChatError(teamId, error))
    })
  }
}


export default fetchTeamChat
