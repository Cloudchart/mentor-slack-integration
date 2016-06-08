import fetch from 'isomorphic-fetch'


function requestUpdateSurvey(id) {
  return {
    type: 'UPDATE_SURVEY_REQUEST',
    id,
  }
}

function receiveUpdateSurvey(id, json) {
  return {
    type: 'UPDATE_SURVEY_RECEIVE',
    id,
    survey: json,
    receivedAt: Date.now()
  }
}

function catchUpdateSurveyError(id, error) {
  return {
    type: 'UPDATE_SURVEY_ERROR',
    id,
    error,
    receivedAt: Date.now()
  }
}

function updateSurvey(id, attrs) {
  return function (dispatch) {
    dispatch(requestUpdateSurvey(id))

    return fetch(`/admin/surveys/${id}`, {
      method: 'PUT',
      body: JSON.stringify(attrs),
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
    }).then(response => response.json()).then(json => {
      return dispatch(receiveUpdateSurvey(id, json))
    }).catch(error => {
      return dispatch(catchUpdateSurveyError(id, error))
    })
  }
}


export default updateSurvey
