import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'

import ThemesList from './ThemesList'


class ChannelsList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      channel: {},
      shouldRenderThemesList: false,
    }
  }

  // handlers
  //
  handleChannelClick(channel, event) {
    event.preventDefault()
    this.setState({ channel: channel, shouldRenderThemesList: true })
    this.props.actions.fetchThemes(channel.id)
  }

  handleThemesListHide() {
    this.setState({ shouldRenderThemesList: false })
  }

  // renderers
  //
  renderChannel(channel) {
    let iconClassNames = classNames('fa', 'fa-circle', channel.status)

    return (
      <li onClick={ this.handleChannelClick.bind(this, channel) }>
        <i className={ iconClassNames } />
        <span>{ `#${channel.name}` }</span>
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
          channel={ this.state.channel }
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
