import React from 'react'
import request from 'superagent'

export default class ChannelsList extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      channels: [],
      selectedChannelIds: [],
    }
  }

  // Handlers
  //
  handleChannelClick(channelId, event) {
    event.preventDefault()
    console.log(channelId);
    // TODO render modal with themes
  }

  // Lifecycle
  //
  componentDidMount() {
    this.serverRequest = request
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

  // Renderers
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

// ChannelsList.propTypes = {
// }

// ChannelsList.defaultProps = {
// }
