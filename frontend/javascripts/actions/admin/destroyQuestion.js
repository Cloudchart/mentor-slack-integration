import fetch from 'isomorphic-fetch'


function requestDestroyQuestion(id) {
  return {
    type: 'DESTROY_QUESTION_REQUEST',
    id,
  }
}

function receiveDestroyQuestion(id, json) {
  return {
    type: 'DESTROY_QUESTION_RECEIVE',
    id,
    receivedAt: Date.now()
  }
}

function catchDestroyQuestionError(id, error) {
  return {
    type: 'DESTROY_QUESTION_ERROR',
    id,
    error: error,
    receivedAt: Date.now()
  }
}

function destroyQuestion(id) {
  return function (dispatch) {
    dispatch(requestDestroyQuestion(id))

    return fetch(`/admin/questions/${id}`, {
      method: 'DELETE',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
    }).then(response => response.json()).then(json => {
      if (json.error) {
        return dispatch(catchDestroyQuestionError(id, json.error))
      } else {
        return dispatch(receiveDestroyQuestion(id, json))
      }
    }).catch(error => {
      return dispatch(catchDestroyQuestionError(id, error))
    })
  }
}


export default destroyQuestion
