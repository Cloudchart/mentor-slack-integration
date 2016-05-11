import React, { Component, PropTypes } from 'react'
import { appName } from '../../data'

import LandingHeader from '../components/LandingHeader'
import Footer from '../components/Footer'



class SupportApp extends Component {

  render() {
    return (
      <div id="support-container">
        <section className="top">
          <div className="bg"></div>

          <LandingHeader
            slackButtonUrl={ this.props.slackButtonUrl }
            telegramButtonUrl={ this.props.telegramButtonUrl }
          />

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
  telegramButtonUrl: PropTypes.string.isRequired,
}


export default SupportApp
