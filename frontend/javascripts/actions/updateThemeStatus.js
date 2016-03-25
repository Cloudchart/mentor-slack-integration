import fetch from 'isomorphic-fetch'


function requestUpdateThemeStatus(id, channelId) {
  return {
    type: 'UPDATE_THEME_STATUS_REQUEST',
    id,
    channelId,
  }
}

function receiveUpdateThemeStatus(id, channelId, json) {
  return {
    type: 'UPDATE_THEME_STATUS_RECEIVE',
    id,
    channelId,
    isSubscribed: json.isSubscribed,
    receivedAt: Date.now(),
  }
}

function catchUpdateThemeStatusError(id, channelId, error) {
  return {
    type: 'UPDATE_THEME_STATUS_ERROR',
    id,
    channelId,
    error: error,
    receivedAt: Date.now(),
  }
}

function updateThemeStatus(id, channelId, action) {
  return function (dispatch) {
    dispatch(requestUpdateThemeStatus(id, channelId))

    return fetch('/themes', {
      method: 'PATCH',
      body: JSON.stringify({ id, channelId, action }),
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
    }).then(response => response.json()).then(json => {
      return dispatch(receiveUpdateThemeStatus(id, channelId, json))
    }).catch(error => {
      return dispatch(catchUpdateThemeStatusError(id, channelId, error))
    })
  }
}


export default updateThemeStatus
