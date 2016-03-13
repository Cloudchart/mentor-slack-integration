function requestUpdateThemeStatus(id) {
  return { type: 'REQUEST_UPDATE_THEME_STATUS', id }
}

function receiveUpdateThemeStatus(id, json) {
  return {
    type: 'RECEIVE_UPDATE_THEME_STATUS',
    id,
    isSubscribed: json.isSubscribed,
    receivedAt: Date.now(),
  }
}

function catchUpdateThemeStatusError(id, error) {
  return {
    type: 'CATCH_UPDATE_THEME_STATUS_ERROR',
    id,
    error: error,
    receivedAt: Date.now(),
  }
}

function updateThemeStatus(id, channelId, action) {
  return function (dispatch) {
    dispatch(requestUpdateThemeStatus(id))

    return fetch('/themes', {
      method: 'POST',
      body: JSON.stringify({ id, channelId, action }),
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
    }).then(response => response.json()).then(json => {
      return dispatch(receiveUpdateThemeStatus(id, json))
    }, error => {
      return dispatch(catchUpdateThemeStatusError(id, error))
    })
  }
}


export default updateThemeStatus
