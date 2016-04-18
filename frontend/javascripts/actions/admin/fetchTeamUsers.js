import fetch from 'isomorphic-fetch'


function requestTeamUsers(teamId) {
  return {
    type: 'TEAM_USERS_REQUEST',
    teamId: teamId,
  }
}

function receiveTeamUsers(teamId, json) {
  return {
    type: 'TEAM_USERS_RECEIVE',
    teamId: teamId,
    users: json.users,
  }
}

function catchTeamUsersError(teamId, error) {
  return {
    type: 'TEAM_USERS_ERROR',
    teamId: teamId,
    error: error,
  }
}

function fetchTeamUsers(teamId) {
  return function (dispatch) {
    dispatch(requestTeamUsers(teamId))

    return fetch(`/admin/teams/${teamId}/users`, {
      credentials: 'same-origin',
      headers: { 'Accept': 'application/json' },
    }).then(response => response.json()).then(json => {
      return dispatch(receiveTeamUsers(teamId, json))
    }).catch(error => {
      return dispatch(catchTeamUsersError(teamId, error))
    })
  }
}


export default fetchTeamUsers
