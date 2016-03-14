function requestDestroyChannel(id) {
  return { type: 'DESTROY_CHANNEL_REQUEST', id }
}

function receiveDestroyChannel(id, json) {
  return {
    type: 'DESTROY_CHANNEL_RECEIVE',
    id,
    status: json.status,
    receivedAt: Date.now()
  }
}

function catchDestroyChannelError(id, error) {
  return {
    type: 'DESTROY_CHANNEL_ERROR',
    id,
    error: error,
    receivedAt: Date.now()
  }
}

function destroyChannel(id) {
  return function (dispatch) {
    dispatch(requestDestroyChannel(id))

    return fetch('/channels', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
    }).then(response => response.json()).then(json => {
      return dispatch(receiveDestroyChannel(id, json))
    }, error => {
      return dispatch(catchDestroyChannelError(id, error))
    })
  }
}


export default destroyChannel
