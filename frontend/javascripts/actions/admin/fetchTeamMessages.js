import fetch from 'isomorphic-fetch'


function requestTeamMessages(teamId) {
  return {
    type: 'TEAM_MESSAGES_REQUEST',
    teamId: teamId,
  }
}

function receiveTeamMessages(teamId, json) {
  return {
    type: 'TEAM_MESSAGES_RECEIVE',
    teamId: teamId,
    messages: json.messages,
  }
}

function catchTeamMessagesError(teamId, error) {
  return {
    type: 'TEAM_MESSAGES_ERROR',
    teamId: teamId,
    error: error,
  }
}

function fetchTeamMessages(teamId) {
  return function (dispatch) {
    dispatch(requestTeamMessages(teamId))

    return fetch(`/admin/teams/${teamId}/messages`, {
      credentials: 'same-origin',
      headers: { 'Accept': 'application/json' },
    }).then(response => response.json()).then(json => {
      return dispatch(receiveTeamMessages(teamId, json))
    }).catch(error => {
      return dispatch(catchTeamMessagesError(teamId, error))
    })
  }
}


export default fetchTeamMessages
