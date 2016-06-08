import fetch from 'isomorphic-fetch'


function requestCreateSurvey() {
  return {
    type: 'CREATE_SURVEY_REQUEST',
  }
}

function receiveCreateSurvey(json) {
  return {
    type: 'CREATE_SURVEY_RECEIVE',
    survey: json,
    receivedAt: Date.now()
  }
}

function catchCreateSurveyError(error) {
  return {
    type: 'CREATE_SURVEY_ERROR',
    error: error,
    receivedAt: Date.now()
  }
}

function createSurvey(attrs) {
  return function (dispatch) {
    dispatch(requestCreateSurvey())

    return fetch('/admin/surveys', {
      method: 'POST',
      body: JSON.stringify(attrs),
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
    }).then(response => response.json()).then(json => {
      if (json.error) {
        return dispatch(catchCreateSurveyError(json.error))
      } else {
        return dispatch(receiveCreateSurvey(json))
      }
    }).catch(error => {
      return dispatch(catchCreateSurveyError(error))
    })
  }
}


export default createSurvey
