import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'

import ThemesList from './ThemesList'


class ChannelsList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      channelId: '',
      shouldRenderThemesList: false,
    }
  }

  // handlers
  //
  handleChannelClick(channelId, event) {
    event.preventDefault()
    this.setState({ channelId: channelId, shouldRenderThemesList: true })
    this.props.actions.fetchThemes(channelId)
  }

  handleThemesListHide() {
    this.setState({ shouldRenderThemesList: false })
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
      <div>
        <h2>Channels:</h2>
        <ul className="channels-list">
          { this.props.channels.map(this.renderChannel.bind(this)) }
        </ul>
        <ThemesList
          channelId={ this.state.channelId }
          themes={ this.props.themes }
          actions={ this.props.actions }
          shouldRenderThemesList={ this.state.shouldRenderThemesList }
          onHide={ this.handleThemesListHide.bind(this) }
        />
      </div>
    )
  }

}

ChannelsList.propTypes = {
  channels: PropTypes.array.isRequired,
  themes: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
}


export default ChannelsList
