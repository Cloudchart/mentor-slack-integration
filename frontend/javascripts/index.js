import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'

let node = document.querySelector('[data-react-class]')
let reactClass = node.dataset.reactClass
let reactType = node.dataset.reactType
let Component = require(`./containers/${reactClass}`).default

if (reactType === 'plain') {
  ReactDOM.render(<Component { ...JSON.parse(node.dataset.reactProps) } />, node)
} else {
  let reducers = require(`./reducers/${reactClass}`).default
  let store = createStore(reducers, window.__INITIAL_STATE__, applyMiddleware(thunkMiddleware))

  ReactDOM.render(
    <Provider store={ store }>
      <Component />
    </Provider>,
    node
  )
}
