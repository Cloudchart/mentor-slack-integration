import fetch from 'isomorphic-fetch'


function requestMessages(userId) {
  return {
    type: 'MESSAGES_REQUEST',
    userId: userId,
  }
}

function receiveMessages(userId, json) {
  return {
    type: 'MESSAGES_RECEIVE',
    userId: userId,
    messages: json.messages,
  }
}

function catchMessagesError(userId, error) {
  return {
    type: 'MESSAGES_ERROR',
    userId: userId,
    error: error,
  }
}

function fetchMessages(userId) {
  return function (dispatch) {
    dispatch(requestMessages(userId))

    return fetch(`/admin/teams/chat/${userId}`, {
      credentials: 'same-origin',
      headers: { 'Accept': 'application/json' },
    }).then(response => response.json()).then(json => {
      return dispatch(receiveMessages(userId, json))
    }).catch(error => {
      return dispatch(catchMessagesError(userId, error))
    })
  }
}


export default fetchMessages
