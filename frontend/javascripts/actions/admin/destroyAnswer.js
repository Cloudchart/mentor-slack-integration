import fetch from 'isomorphic-fetch'


function requestDestroyAnswer(id) {
  return {
    type: 'DESTROY_ANSWER_REQUEST',
    id,
  }
}

function receiveDestroyAnswer(id, json) {
  return {
    type: 'DESTROY_ANSWER_RECEIVE',
    id,
    receivedAt: Date.now()
  }
}

function catchDestroyAnswerError(id, error) {
  return {
    type: 'DESTROY_ANSWER_ERROR',
    id,
    error: error,
    receivedAt: Date.now()
  }
}

function destroyAnswer(id) {
  return function (dispatch) {
    dispatch(requestDestroyAnswer(id))

    return fetch(`/admin/answers/${id}`, {
      method: 'DELETE',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
    }).then(response => response.json()).then(json => {
      if (json.error) {
        return dispatch(catchDestroyAnswerError(id, json.error))
      } else {
        return dispatch(receiveDestroyAnswer(id, json))
      }
    }).catch(error => {
      return dispatch(catchDestroyAnswerError(id, error))
    })
  }
}


export default destroyAnswer
