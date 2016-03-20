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

          <a href={ this.props.slackButtonUrl }>
            <img
              alt="Add to Slack"
              height="40"
              width="139"
              src="https://platform.slack-edge.com/img/add_to_slack.png"
              srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
            />
          </a>
        </header>

        <div className="content">
          <div className="boris">
            <p>
              Get actionable entrepreneurial advice from the <strong>Virtual Mentor</strong> right
              in your <i className="fa fa-slack"/>Slack
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
          Whant to have your own mentor to give you proven actionable advice
          on the go? <a href="" onClick={ this.handleSignUpLink.bind(this) }>Sign up for the private beta!</a>
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
