import React, { Component, PropTypes } from 'react'
import { appName } from '../../data'

import LandingHeader from '../components/LandingHeader'
import BotButton from '../components/BotButton'
import Footer from '../components/Footer'


class LandingApp extends Component {

  // handlers
  //
  handleSignUpLink(event) {
    event.preventDefault()
  }

  // renderers
  //
  renderTopSection() {
    return(
      <section className="top">
        <div className="bg"></div>

        <LandingHeader
          slackButtonUrl={ this.props.slackButtonUrl }
          telegramButtonUrl={ this.props.telegramButtonUrl }
        />

        <div className="content">
          <div className="boris">
            <p>
              Get actionable entrepreneurial advice from <strong>{ appName }</strong> right
              in your <span className="slack"><i className="fa fa-slack"/>Slack</span> and <span className="telegram">
              <i className="fa fa-paper-plane"/>Telegram</span>
            </p>
            <div className="main-action">
              <BotButton type="slack" url={ this.props.slackButtonUrl } />
              <i className="dashed-arrow inverted"/>
              <span className="boris-logo"></span>
              <i className="dashed-arrow normal"/>
              <BotButton type="telegram" url={ this.props.telegramButtonUrl } isTargetBlank={ true } />
            </div>
          </div>

          <p>
            Advice by prominent mentors on growth hacking, product,
            investors, company culture, and other crucial topics
          </p>
        </div>
      </section>
    )
  }

  renderFeatures() {
    return(
      <section className="features">
        <div className="slack">
          <div className="window"></div>

          <div className="description">
            <h1>
              { appName } for <strong>Slack</strong>
            </h1>
            <ul>
              <li>
                Get advice for your team
              </li>
              <li>
                Post relevant advice to specific channels
              </li>
              <li>
                Discuss and put advice to work instantly
              </li>
            </ul>

            <div className="bot">
              <BotButton type="slack" url={ this.props.slackButtonUrl } color="gray" />
              <i className="dashed-arrow flipped"/>
              <span className="boris-logo"></span>
            </div>
          </div>
        </div>

        <div className="telegram">
          <div className="description">
            <h1>
              { appName } for <strong>Telegram</strong>
            </h1>
            <ul>
              <li>
                Get advice right in the messenger
              </li>
              <li>
                Ask the bot for it
              </li>
              <li>
                Share advice with your friends or to your personal channel
              </li>
            </ul>

            <div className="bot">
              <BotButton
                type="telegram"
                url={ this.props.telegramButtonUrl }
                isTargetBlank={ true }
                color="gray"
              />
            </div>
          </div>

          <div className="window"></div>
        </div>
      </section>
    )
  }

  renderBottomSection() {
    return(
      <section className="bottom">
        <p>
          Follow <i className="fa fa-twitter"/> <a href="https://twitter.com/thementorbot" target="_blank">@thementorbot</a> or <a href="mailto:team@getmentorbot.com">get in touch with us</a>
        </p>
      </section>
    )
  }

  render() {
    return (
      <div id="landing-container">
        { this.renderTopSection() }
        { this.renderFeatures() }
        { this.renderBottomSection() }
        <Footer/>
      </div>
    )
  }

}

LandingApp.propTypes = {
  slackButtonUrl: PropTypes.string.isRequired,
  telegramButtonUrl: PropTypes.string.isRequired,
}


export default LandingApp
