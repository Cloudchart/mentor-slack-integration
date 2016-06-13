import fetch from 'isomorphic-fetch'


function requestDestroyResult(id) {
  return {
    type: 'DESTROY_RESULT_REQUEST',
    id,
  }
}

function receiveDestroyResult(id, json) {
  return {
    type: 'DESTROY_RESULT_RECEIVE',
    id,
    receivedAt: Date.now()
  }
}

function catchDestroyResultError(id, error) {
  return {
    type: 'DESTROY_RESULT_ERROR',
    id,
    error: error,
    receivedAt: Date.now()
  }
}

function destroyResult(id) {
  return function (dispatch) {
    dispatch(requestDestroyResult(id))

    return fetch(`/admin/results/${id}`, {
      method: 'DELETE',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
    }).then(response => response.json()).then(json => {
      if (json.error) {
        return dispatch(catchDestroyResultError(id, json.error))
      } else {
        return dispatch(receiveDestroyResult(id, json))
      }
    }).catch(error => {
      return dispatch(catchDestroyResultError(id, error))
    })
  }
}


export default destroyResult
