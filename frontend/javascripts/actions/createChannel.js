function requestCreateChannel(id) {
  return { type: 'CREATE_CHANNEL_REQUEST', id }
}

function receiveCreateChannel(id, json) {
  return {
    type: 'CREATE_CHANNEL_RECEIVE',
    id,
    status: json.status,
    receivedAt: Date.now()
  }
}

function catchCreateChannelError(id, error) {
  return {
    type: 'CREATE_CHANNEL_ERROR',
    id,
    error: error,
    receivedAt: Date.now()
  }
}

function createChannel(id) {
  return function (dispatch) {
    dispatch(requestCreateChannel(id))

    return fetch('/channels', {
      method: 'POST',
      body: JSON.stringify({ id }),
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
    }).then(response => response.json()).then(json => {
      return dispatch(receiveCreateChannel(id, json))
    }).catch(error => {
      return dispatch(catchCreateChannelError(id, error))
    })
  }
}


export default createChannel
