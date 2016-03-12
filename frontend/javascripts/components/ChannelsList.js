import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'

import ThemesList from './ThemesList'


class ChannelsList extends Component {

  // handlers
  //
  handleChannelClick(channelId, event) {
    event.preventDefault()
    const { actions } = this.props

    actions.fetchThemes(channelId).then(data => {
      ReactDOM.render(
        <ThemesList
          channelId={ channelId }
          themes={ this.props.themes }
          actions={ actions }
        />, document.getElementById('modal')
      )
    })
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
    // console.log('ChannelsList', 'render', this.props.themes);
    return (
      <ul className="channels-list">
        { this.props.channels.map(this.renderChannel.bind(this)) }
      </ul>
    )
  }

}

ChannelsList.propTypes = {
  channels: PropTypes.array.isRequired,
  themes: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
}


export default ChannelsList
