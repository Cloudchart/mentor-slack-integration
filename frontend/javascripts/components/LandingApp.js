import React from 'react'

export default class LandingApp extends React.Component {

  // Handlers
  //

  // Renderers
  //
  render() {
    return (
      <div className="container">
        <h2>Welcome</h2>
        <a href={ this.props.slackButtonUrl }>
          <img
            alt="Add to Slack"
            height="40"
            width="139"
            src="https://platform.slack-edge.com/img/add_to_slack.png"
            srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
          />
        </a>
      </div>
    )
  }

}

LandingApp.propTypes = {
  slackButtonUrl: React.PropTypes.string.isRequired,
}

// LandingApp.defaultProps = {
// }
