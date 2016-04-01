import fetch from 'isomorphic-fetch'


function requestChannels() {
  return {
    type: 'CHANNELS_REQUEST',
  }
}

function receiveChannels(json) {
  return {
    type: 'CHANNELS_RECEIVE',
    channels: json.channels,
    status: json.status,
    receivedAt: Date.now(),
  }
}

function catchChannelsError(error) {
  return {
    type: 'CHANNELS_ERROR',
    error: error,
    receivedAt: Date.now(),
  }
}

function fetchChannels() {
  return function (dispatch) {
    dispatch(requestChannels())

    return fetch('/channels', {
      credentials: 'same-origin',
      headers: { 'Accept': 'application/json' },
    }).then(response => response.json()).then(json => {
      return dispatch(receiveChannels(json))
    }).catch(error => {
      return dispatch(catchChannelsError(error))
    })
  }
}


export default fetchChannels
