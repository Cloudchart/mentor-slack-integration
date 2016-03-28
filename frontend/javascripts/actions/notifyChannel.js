import fetch from 'isomorphic-fetch'


function notifyChannel(id) {
  return function (dispatch) {

    return fetch('/channels/notify', {
      method: 'POST',
      body: JSON.stringify({ id }),
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
    })
  }
}


export default notifyChannel
