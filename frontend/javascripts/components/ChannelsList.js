import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'

import Channel from './Channel'
import ThemesList from './ThemesList'


class ChannelsList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedChannel: {},
    }
  }

  // handlers
  //
  handleTestIntegrationClick(event) {
    this.props.actions.fetchChannels()
  }

  handleChannelClick(channel, event) {
    event.preventDefault()
    this.setState({ selectedChannel: channel })
  }

  handleThemesListHide() {
    this.setState({ selectedChannel: {} })
  }

  // renderers
  //
  renderTestIntegrationButton() {
    return(
      <button className='msi' disabled={ this.props.channels.isFetching } onClick={ this.handleTestIntegrationClick.bind(this) }>
        Test Boris integration
      </button>
    )
  }

  render() {
    const { themes, actions } = this.props

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
          channel={ this.state.selectedChannel }
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
