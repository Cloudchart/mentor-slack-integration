import fetch from 'isomorphic-fetch'


function requestCreateQuestion(surveyId) {
  return {
    type: 'CREATE_QUESTION_REQUEST',
    surveyId,
  }
}

function receiveCreateQuestion(surveyId, json) {
  return {
    type: 'CREATE_QUESTION_RECEIVE',
    surveyId,
    question: json,
    receivedAt: Date.now()
  }
}

function catchCreateQuestionError(surveyId, error) {
  return {
    type: 'CREATE_QUESTION_ERROR',
    surveyId,
    error: error,
    receivedAt: Date.now()
  }
}

function createQuestion(surveyId) {
  return function (dispatch) {
    dispatch(requestCreateQuestion())

    return fetch(`/admin/surveys/${surveyId}/questions`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
    }).then(response => response.json()).then(json => {
      if (json.error) {
        return dispatch(catchCreateQuestionError(surveyId, json.error))
      } else {
        return dispatch(receiveCreateQuestion(surveyId, json))
      }
    }).catch(error => {
      return dispatch(catchCreateQuestionError(surveyId, error))
    })
  }
}


export default createQuestion
