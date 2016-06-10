import fetch from 'isomorphic-fetch'


function requestCreateResult(surveyId) {
  return {
    type: 'CREATE_RESULT_REQUEST',
    surveyId,
  }
}

function receiveCreateResult(surveyId, json) {
  return {
    type: 'CREATE_RESULT_RECEIVE',
    surveyId,
    result: json,
    receivedAt: Date.now()
  }
}

function catchCreateResultError(surveyId, error) {
  return {
    type: 'CREATE_RESULT_ERROR',
    surveyId,
    error: error,
    receivedAt: Date.now()
  }
}

function createResult(surveyId) {
  return function (dispatch) {
    dispatch(requestCreateResult())

    return fetch(`/admin/surveys/${surveyId}/results`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
    }).then(response => response.json()).then(json => {
      if (json.error) {
        return dispatch(catchCreateResultError(surveyId, json.error))
      } else {
        return dispatch(receiveCreateResult(surveyId, json))
      }
    }).catch(error => {
      return dispatch(catchCreateResultError(surveyId, error))
    })
  }
}


export default createResult
