import React from 'react'
import ReactDOM from 'react-dom'

Array.prototype.forEach.call(document.querySelectorAll('[data-react-class]'), node => {
  let Component = require('./components/' + node.dataset.reactClass).default
  ReactDOM.render(<Component { ...JSON.parse(node.dataset.reactProps) } />, node)
})


// $('.user-theme').on('click', (event) => {
//   $.ajax({
//     url: '/themes',
//     method: 'POST',
//     data: {
//       channelId: event.target.name,
//       userThemeId: event.target.value,
//       checked: event.target.checked,
//     // error: (jqXHR, textStatus, errorThrown) =>
//     // success: (data, textStatus, jqXHR) =>
//     }
//   })
// })
