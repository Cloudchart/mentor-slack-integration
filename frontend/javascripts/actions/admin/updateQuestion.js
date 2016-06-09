import fetch from 'isomorphic-fetch'


function requestUpdateQuestion(id) {
  return {
    type: 'UPDATE_QUESTION_REQUEST',
    id,
  }
}

function receiveUpdateQuestion(id, json) {
  return {
    type: 'UPDATE_QUESTION_RECEIVE',
    id,
    question: json,
    receivedAt: Date.now()
  }
}

function catchUpdateQuestionError(id, error) {
  return {
    type: 'UPDATE_QUESTION_ERROR',
    id,
    error,
    receivedAt: Date.now()
  }
}

function updateQuestion(id, attrs) {
  return function (dispatch) {
    dispatch(requestUpdateQuestion(id))

    return fetch(`/admin/questions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(attrs),
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
    }).then(response => response.json()).then(json => {
      if (json.error) {
        return dispatch(catchUpdateQuestionError(id, json.error))
      } else {
        return dispatch(receiveUpdateQuestion(id, json))
      }
    }).catch(error => {
      return dispatch(catchUpdateQuestionError(id, error))
    })
  }
}


export default updateQuestion
