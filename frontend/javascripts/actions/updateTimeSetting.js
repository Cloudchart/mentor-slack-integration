function requestUpdateTimeSetting(attr, value) {
  return {
    type: 'UPDATE_TIME_SETTING_REQUEST',
    attr,
    value
  }
}

function receiveUpdateTimeSetting(attr, json) {
  return {
    type: 'UPDATE_TIME_SETTING_RECEIVE',
    attr,
    value: json[attr],
  }
}

function catchUpdateTimeSettingError(attr, error) {
  return {
    type: 'UPDATE_TIME_SETTING_ERROR',
    attr,
    value: json[attr],
    error: error,
  }
}

function updateTimeSetting(attr, value) {
  return function (dispatch) {
    dispatch(requestUpdateTimeSetting(attr, value))

    return fetch('/time_settings', {
      method: 'PUT',
      body: JSON.stringify({ attr, value }),
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
    }).then(response => response.json()).then(json => {
      return dispatch(receiveUpdateTimeSetting(attr, json))
    }, error => {
      return dispatch(catchUpdateTimeSettingError(attr, error))
    })
  }
}


export default updateTimeSetting
