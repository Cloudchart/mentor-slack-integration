import React, { Component, PropTypes } from 'react'

import SlackButton from '../components/SlackButton'
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
        <header>
          <div className="logo">
            <span className="main-logo"></span>
            <span>Virtual <strong>Mentor</strong></span>
          </div>

          <SlackButton slackButtonUrl={ this.props.slackButtonUrl } text="login" size="small" />
        </header>

        <div className="content">
          <div className="boris">
            <p>
              Get actionable entrepreneurial advices from the <strong>Virtual Mentor</strong> right
              in your <span className="slack"><i className="fa fa-slack"/>Slack</span>
            </p>
            <div className="main-action">
              <span className="boris-logo"></span>
              <i className="dashed-arrow"/>
              <SlackButton slackButtonUrl={ this.props.slackButtonUrl } />
            </div>
          </div>

          <p>
            Put the advices to work instantly, share with your team,
            and get smarter without distracting from your work
          </p>
        </div>
      </section>
    )
  }

  renderFeatures() {
    return(
      <section className="features">
        <div className="slack-window"></div>
        <div className="description">
          <h1>
            What <strong>Virtual Mentor</strong> can do for you
          </h1>
          <ul>
            <li>
              Give you actionable advice by successful entrepreneurs
              on growth hacking, product management, design, culture,
              and other key topics
            </li>
            <li>
              Post relevant advice to specific channels
            </li>
            <li>
              Provide links to advice sources for further study
            </li>
          </ul>
        </div>
      </section>
    )
  }

  renderBottomSection() {
    return(
      <section className="bottom">
        <SlackButton slackButtonUrl={ this.props.slackButtonUrl } />
        <p>
          This Slack bot is part of The Virtual Mentor app (currently in beta).
          Want to have your own mentor to give you proven actionable advice
          on the go? <a href="mailto:team@insights.vc">Sign up for the private beta testing!</a>
        </p>
        <p>
          Follow <i className="fa fa-twitter"/> <a href="https://twitter.com/thementorapp" target="_blank">@thementorapp</a>
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
}


export default LandingApp
