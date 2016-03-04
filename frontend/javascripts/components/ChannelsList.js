import React from 'react'
import ReactDOM from 'react-dom'
import superagent from 'superagent'

import ThemesList from './ThemesList'


export default class ChannelsList extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      channels: [],
      selectedChannelIds: [],
    }
  }

  // lifecycle
  //
  componentDidMount() {
    this.serverRequest = superagent
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

  componentWillUnmount() {
    this.serverRequest.abort()
  }

  // handlers
  //
  handleChannelClick(channelId, event) {
    event.preventDefault()
    ReactDOM.render(<ThemesList channelId={ channelId }/>, document.getElementById('modal'))
  }

  // renderers
  //
  renderChannel(channel) {
    return (
      <li>
        <a href="" onClick={ this.handleChannelClick.bind(this, channel.id) } >
          { `#${channel.name}` }
        </a>
      </li>
    )
  }

  render() {
    return (
      <ul>
        { this.state.channels.map(this.renderChannel.bind(this)) }
      </ul>
    )
  }

}
