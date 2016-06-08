import fetch from 'isomorphic-fetch'


function requestDestroySurvey(id) {
  return {
    type: 'DESTROY_SURVEY_REQUEST',
    id,
  }
}

function receiveDestroySurvey(id, json) {
  return {
    type: 'DESTROY_SURVEY_RECEIVE',
    id,
    receivedAt: Date.now()
  }
}

function catchDestroySurveyError(id, error) {
  return {
    type: 'DESTROY_SURVEY_ERROR',
    id,
    error: error,
    receivedAt: Date.now()
  }
}

function destroySurvey(id) {
  return function (dispatch) {
    dispatch(requestDestroySurvey(id))

    return fetch(`/admin/surveys/${id}`, {
      method: 'DELETE',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
    }).then(response => response.json()).then(json => {
      if (json.error) {
        return dispatch(catchDestroySurveyError(id, json.error))
      } else {
        return dispatch(receiveDestroySurvey(id, json))
      }
    }).catch(error => {
      return dispatch(catchDestroySurveyError(id, error))
    })
  }
}


export default destroySurvey
