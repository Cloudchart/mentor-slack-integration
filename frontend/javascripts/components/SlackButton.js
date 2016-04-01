import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'

const buttonText = {
  default: <span>Add <strong>MentorBot</strong> to Slack</span>,
  login: <span>Login with <strong>Slack</strong></span>,
}


class SlackButton extends Component {

  handleSlackButtonClick(event) {
    window.location = this.props.slackButtonUrl
  }

  render() {
    const { size, text } = this.props
    const buttonClassNames = classNames('slack-button', { [size]: size })

    return (
      <div className={ buttonClassNames } onClick={ this.handleSlackButtonClick.bind(this) }>
        <i/>
        { buttonText[text] }
      </div>
    )
  }

}

SlackButton.propTypes = {
  slackButtonUrl: PropTypes.string.isRequired,
}

SlackButton.defaultProps = {
  text: 'default',
  size: '',
}


export default SlackButton
