import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'

import { botName } from '../../data'

import Channel from './Channel'
import ThemesList from './ThemesList'


class ChannelsList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedChannelId: '',
    }
  }

  // handlers
  //
  handleTestIntegrationClick(event) {
    this.props.actions.fetchChannels()
  }

  handleChannelClick(channel, event) {
    event.preventDefault()
    this.setState({ selectedChannelId: channel.id })
  }

  handleThemesListHide() {
    this.setState({ selectedChannelId: '' })
  }

  // renderers
  //
  renderTestIntegrationButton() {
    return(
      <button className='msi' disabled={ this.props.channels.isFetching } onClick={ this.handleTestIntegrationClick.bind(this) }>
        { `Test @${botName} integration` }
      </button>
    )
  }

  render() {
    const { themes, actions, channels } = this.props

    return (
      <div>
        <h2>Channels:</h2>

        <ul className="channels-list">
          { this.props.channels.items.map(channel =>
            <Channel
              channel={ channel }
              themes={ themes }
              actions={ actions }
              onClick={ this.handleChannelClick.bind(this) }
            />
          )}
        </ul>

        <ThemesList
          selectedChannelId={ this.state.selectedChannelId }
          channels={ channels }
          themes={ themes }
          actions={ actions }
          onHide={ this.handleThemesListHide.bind(this) }
        />

        { this.renderTestIntegrationButton() }
      </div>
    )
  }

}

ChannelsList.propTypes = {
  channels: PropTypes.object.isRequired,
  themes: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
}


export default ChannelsList
