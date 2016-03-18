import React, { Component, PropTypes } from 'react'

export default class LandingApp extends Component {

  render() {
    return (
      <div id="landing-container">
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

          <div className="boris">
            <p>
              Get actionable entrepreneurial advice from the
              <strong>Virtual Mentor</strong> right in your <i className="fa fa-slack"/>Slack
            </p>
            <div className="main-action">
              <span className="boris-logo"></span>
              <i className="dashed-arrow"/>
              <div className="slack-button">
                <i/>
                <span>Add <strong>Mentor</strong> to Slack</span>
              </div>
            </div>
          </div>

          <p>
            Put the advices to work instantly, share with your team,
            and get smarter without distracting from your work
          </p>
        </section>

        <section className="features"></section>
        <section className="bottom"></section>
      </div>
    )
  }

}

LandingApp.propTypes = {
  slackButtonUrl: PropTypes.string.isRequired,
}
