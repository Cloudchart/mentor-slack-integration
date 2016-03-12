function selectChannel(id) {
  return { type: 'SELECT_CHANNEL', id }
}

function requestThemes(channelId) {
  return { type: 'REQUEST_THEMES', channelId }
}

function receiveThemes(channelId, json) {
  return {
    type: 'RECEIVE_THEMES',
    channelId,
    themes: json.themes,
    receivedAt: Date.now()
  }
}

function catchThemesError(channelId, error) {
  return {
    type: 'CATCH_THEMES_ERROR',
    channelId,
    error: error,
    receivedAt: Date.now()
  }
}

function fetchThemes(channelId) {
  return function (dispatch) {
    dispatch(requestThemes(channelId))

    return fetch(`/themes?channelId=${channelId}`, {
      credentials: 'same-origin',
      headers: { 'Accept': 'application/json' },
    }).then(response => response.json()).then(json => {
      return dispatch(receiveThemes(channelId, json))
    }, error => {
      return dispatch(catchThemesError(channelId, error))
    })
  }
}


export const configActions = {
  selectChannel,
  fetchThemes,
}
