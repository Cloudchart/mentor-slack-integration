import fetch from 'isomorphic-fetch'


function requestAnswerQuestion(id) {
  return {
    type: 'ANSWER_QUESTION_REQUEST',
    id,
  }
}

function receiveAnswerQuestion(id, json) {
  return {
    type: 'ANSWER_QUESTION_RECEIVE',
    id,
    userAnswer: json.userAnswer,
    correctAnswerIds: json.correctAnswerIds,
    receivedAt: Date.now(),
  }
}

function catchAnswerQuestionError(id, error) {
  return {
    type: 'ANSWER_QUESTION_ERROR',
    id,
    error: error,
    receivedAt: Date.now(),
  }
}

function answerQuestion(id) {
  return function (dispatch) {
    dispatch(requestAnswerQuestion(id))

    return fetch('/surveys/answer', {
      method: 'POST',
      body: JSON.stringify({ id }),
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
    }).then(response => response.json()).then(json => {
      return dispatch(receiveAnswerQuestion(id, json))
    }).catch(error => {
      return dispatch(catchAnswerQuestionError(id, error))
    })
  }
}


export default answerQuestion
