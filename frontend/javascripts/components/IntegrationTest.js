import React, { Component, PropTypes } from 'react'
import { appName, botName } from '../../data'

const messages = {
  'non_selected': `Please select at least one channel for ${appName} to post to, then press the button again to retest.`,
  'awaiting_invitation': `Please type /invite @${botName} in each channel where you want the bot to post advice to. Press the button to retest.`,
  'ok': `Success! Your ${appName} is ready to serve its new Master.`,
  'error': "Something went really wrong. Please try again later.",
}


class IntegrationTest extends Component {

  handleTestIntegrationClick(event) {
    this.props.actions.fetchChannels()
  }

  render() {
    const { channels } = this.props

    return (
      <div className="intergation-test">
        <button className='msi' disabled={ channels.isFetching } onClick={ this.handleTestIntegrationClick.bind(this) }>
          { `Test @${botName} integration` }
        </button>
        <div className="status">{ messages[channels.status] }</div>
      </div>
    )
  }

}

IntegrationTest.propTypes = {
  channels: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
}


export default IntegrationTest
