import React from 'react'
import ReactDOM from 'react-dom'

Array.prototype.forEach.call(document.querySelectorAll('[data-react-class]'), node => {
  let Component = require('./components/' + node.dataset.reactClass).default
  ReactDOM.render(<Component { ...JSON.parse(node.dataset.reactProps) } />, node)
})
