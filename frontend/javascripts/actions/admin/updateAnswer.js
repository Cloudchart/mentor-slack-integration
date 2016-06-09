import fetch from 'isomorphic-fetch'


function requestUpdateAnswer(id) {
  return {
    type: 'UPDATE_ANSWER_REQUEST',
    id,
  }
}

function receiveUpdateAnswer(id, json) {
  return {
    type: 'UPDATE_ANSWER_RECEIVE',
    id,
    answer: json,
    receivedAt: Date.now()
  }
}

function catchUpdateAnswerError(id, error) {
  return {
    type: 'UPDATE_ANSWER_ERROR',
    id,
    error,
    receivedAt: Date.now()
  }
}

function updateAnswer(id, attrs) {
  return function (dispatch) {
    dispatch(requestUpdateAnswer(id))

    return fetch(`/admin/answers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(attrs),
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
    }).then(response => response.json()).then(json => {
      if (json.error) {
        return dispatch(catchUpdateAnswerError(id, json.error))
      } else {
        return dispatch(receiveUpdateAnswer(id, json))
      }
    }).catch(error => {
      return dispatch(catchUpdateAnswerError(id, error))
    })
  }
}


export default updateAnswer
