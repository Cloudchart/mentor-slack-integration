import React from 'react'
import ReactDOM from 'react-dom'
import superagent from 'superagent'
import classNames from 'classnames'

import ThemesList from './ThemesList'


export default class ChannelsList extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      channels: [],
    }
  }

  // lifecycle
  //
  componentDidMount() {
    this.getInitialData()
  }

  componentWillUnmount() {
    this.initialRequest.abort()
  }

  // requests
  //
  getInitialData() {
    this.initialRequest = superagent
      .get('/channels')
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err || !res.ok) {
          console.error(err)
        } else {
          this.setState(res.body)
        }
      })
  }

  // handlers
  //
  handleChannelClick(channelId, event) {
    event.preventDefault()
    ReactDOM.render(
      <ThemesList channelId={ channelId }/>, document.getElementById('modal')
    )
  }

  // renderers
  //
  renderChannel(channel) {
    let iconClassNames = classNames('fa', 'fa-circle', channel.status)

    return (
      <li>
        <i className={ iconClassNames }/>
        <span>#</span>
        <a href="" onClick={ this.handleChannelClick.bind(this, channel.id) }>
          { channel.name }
        </a>
      </li>
    )
  }

  render() {
    return (
      <ul className="channels-list">
        { this.state.channels.map(this.renderChannel.bind(this)) }
      </ul>
    )
  }

}
