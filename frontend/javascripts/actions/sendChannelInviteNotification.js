import fetch from 'isomorphic-fetch'


function sendChannelInviteNotification(id, name) {
  return function (dispatch) {
    return fetch('/channels/send_notification', {
      method: 'POST',
      body: JSON.stringify({ id: id, name: name, type: 'invite_notification' }),
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
    })
  }
}


export default sendChannelInviteNotification
