import fetch from 'isomorphic-fetch'


function requestUpdateChannel(id, attr, value) {
  return {
    type: 'UPDATE_CHANNEL_REQUEST',
    id,
    attr,
    value,
  }
}

function receiveUpdateChannel(id, attr, json) {
  return {
    type: 'UPDATE_CHANNEL_RECEIVE',
    id,
    attr,
    value: json[attr],
  }
}

function catchUpdateChannelError(id, attr, error) {
  return {
    type: 'UPDATE_CHANNEL_ERROR',
    id,
    attr,
    error: error,
  }
}

function updateChannel(id, attr, value) {
  return function (dispatch) {
    dispatch(requestUpdateChannel(id, attr, value))

    return fetch(`/channels/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ attr, value }),
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
    }).then(response => response.json()).then(json => {
      if (json.error) {
        return dispatch(catchUpdateChannelError(id, attr, json.error))
      } else {
        return dispatch(receiveUpdateChannel(id, attr, json))
      }
    }).catch(error => {
      return dispatch(catchUpdateChannelError(id, attr, error))
    })
  }
}


export default updateChannel
