import React, { Component, PropTypes } from 'react'


class LandingHeader extends Component {

  render() {
    return (
      <header>
        <a href="/" className="logo">
          <span className="main-logo"></span>
          <span>Mentor<strong>Bot</strong></span>
        </a>

        <ul className="links">
          <li>
            <a href={ this.props.slackButtonUrl }>Slack</a>
          </li>
          <li>
            <a href={ this.props.telegramButtonUrl } target="_blank">Telegram</a>
          </li>
        </ul>
      </header>
    )
  }

}

LandingHeader.propTypes = {
  slackButtonUrl: PropTypes.string.isRequired,
  telegramButtonUrl: PropTypes.string.isRequired,
}


export default LandingHeader
