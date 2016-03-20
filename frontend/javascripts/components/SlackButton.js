import React, { Component, PropTypes } from 'react'

export default class SlackButton extends Component {

  handleSlackButtonClick(event) {
    window.location = this.props.slackButtonUrl
  }

  render() {
    return (
      <div className="slack-button" onClick={ this.handleSlackButtonClick.bind(this) }>
        <i/>
        <span>Add <strong>Mentor</strong> to Slack</span>
      </div>
    )
  }

}

SlackButton.propTypes = {
  slackButtonUrl: PropTypes.string.isRequired,
}
