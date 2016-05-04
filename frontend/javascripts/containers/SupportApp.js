import React, { Component, PropTypes } from 'react'
import { appName } from '../../data'

import SlackButton from '../components/SlackButton'
import Footer from '../components/Footer'


class SupportApp extends Component {

  render() {
    return (
      <div id="support-container">
        <section className="top">
          <div className="bg"></div>
          <header>
            <a href="/" className="logo">
              <span className="main-logo"></span>
              <span>Mentor<strong>Bot</strong></span>
            </a>

            <SlackButton slackButtonUrl={ this.props.slackButtonUrl } text="login" size="small" />
          </header>

          <div className="content">
            <p className="main-message">
              Having problems? Want to tell us how we can make <strong>{ appName }</strong> better
              for you? Don't hesitate to get in touch: <a href="mailto:support@getmentorbot.com">support@getmentorbot.com</a>
            </p>
            <p>
              (real humans on support line)
            </p>
          </div>
        </section>
        <Footer/>
      </div>
    )
  }

}

SupportApp.propTypes = {
  slackButtonUrl: PropTypes.string.isRequired,
}


export default SupportApp
