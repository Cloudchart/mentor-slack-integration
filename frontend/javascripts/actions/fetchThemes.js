function requestThemes(channelId) {
  return { type: 'THEMES_REQUEST', channelId }
}

function receiveThemes(channelId, json) {
  return {
    type: 'THEMES_RECEIVE',
    channelId,
    themes: json.themes,
    receivedAt: Date.now()
  }
}

function catchThemesError(channelId, error) {
  return {
    type: 'THEMES_ERROR',
    channelId,
    error: error,
    receivedAt: Date.now()
  }
}

function fetchThemes(channelId) {
  return function (dispatch) {
    dispatch(requestThemes(channelId))

    return fetch(`/themes/${channelId}`, {
      credentials: 'same-origin',
      headers: { 'Accept': 'application/json' },
    }).then(response => response.json()).then(json => {
      return dispatch(receiveThemes(channelId, json))
    }, error => {
      return dispatch(catchThemesError(channelId, error))
    })
  }
}


export default fetchThemes
