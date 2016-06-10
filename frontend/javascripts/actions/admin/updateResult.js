import fetch from 'isomorphic-fetch'


function requestUpdateResult(id) {
  return {
    type: 'UPDATE_RESULT_REQUEST',
    id,
  }
}

function receiveUpdateResult(id, json) {
  return {
    type: 'UPDATE_RESULT_RECEIVE',
    id,
    result: json,
    receivedAt: Date.now()
  }
}

function catchUpdateResultError(id, error) {
  return {
    type: 'UPDATE_RESULT_ERROR',
    id,
    error,
    receivedAt: Date.now()
  }
}

function updateResult(id, form) {
  return function (dispatch) {
    dispatch(requestUpdateResult(id))

    return fetch(`/admin/results/${id}`, {
      method: 'PUT',
      body: new FormData(form),
      credentials: 'same-origin',
      // headers: { 'Content-Type': 'application/json' },
    }).then(response => response.json()).then(json => {
      if (json.error) {
        return dispatch(catchUpdateResultError(id, json.error))
      } else {
        return dispatch(receiveUpdateResult(id, json))
      }
    }).catch(error => {
      return dispatch(catchUpdateResultError(id, error))
    })
  }
}


export default updateResult
