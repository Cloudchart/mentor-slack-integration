import fetch from 'isomorphic-fetch'


function requestPostMessage(userId, text) {
  return {
    type: 'POST_MESSAGE_REQUEST',
    userId: userId,
    text: text,
  }
}

function receivePostMessage(userId, json) {
  return {
    type: 'POST_MESSAGE_RECEIVE',
    userId: userId,
    message: json.message,
  }
}

function catchPostMessageError(userId, error) {
  return {
    type: 'POST_MESSAGE_ERROR',
    userId: userId,
    error: error,
  }
}

function postMessage(userId, text) {
  return function (dispatch) {
    dispatch(requestPostMessage(userId, text))

    return fetch(`/admin/teams/chat/${userId}`, {
      method: 'POST',
      body: JSON.stringify({ text }),
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
    }).then(response => response.json()).then(json => {
      return dispatch(receivePostMessage(userId, json))
    }).catch(error => {
      return dispatch(catchPostMessageError(userId, error))
    })
  }
}


export default postMessage
