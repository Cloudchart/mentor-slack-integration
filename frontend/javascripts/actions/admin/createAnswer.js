import fetch from 'isomorphic-fetch'


function requestCreateAnswer(questionId) {
  return {
    type: 'CREATE_ANSWER_REQUEST',
    questionId,
  }
}

function receiveCreateAnswer(questionId, json) {
  return {
    type: 'CREATE_ANSWER_RECEIVE',
    questionId,
    answer: json,
    receivedAt: Date.now()
  }
}

function catchCreateAnswerError(questionId, error) {
  return {
    type: 'CREATE_ANSWER_ERROR',
    questionId,
    error: error,
    receivedAt: Date.now()
  }
}

function createAnswer(questionId) {
  return function (dispatch) {
    dispatch(requestCreateAnswer())

    return fetch(`/admin/questions/${questionId}/answers`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
    }).then(response => response.json()).then(json => {
      if (json.error) {
        return dispatch(catchCreateAnswerError(questionId, json.error))
      } else {
        return dispatch(receiveCreateAnswer(questionId, json))
      }
    }).catch(error => {
      return dispatch(catchCreateAnswerError(questionId, error))
    })
  }
}


export default createAnswer
