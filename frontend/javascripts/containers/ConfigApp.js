import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { configActions } from '../actions'

import ChannelsList from '../components/ChannelsList'
import TimeSetting from '../components/TimeSetting'


class ConfigApp extends Component {

  render() {
    const { team, channels, themes, timeSetting, actions } = this.props

    return (
      <div>
        <h1>
          <i className="fa fa-cogs" />
          <span>{ `Configure Virtual Mentor integration for ${team.name}` }</span>
        </h1>

        <TimeSetting
          timeSetting={ timeSetting }
          actions={ actions }
        />

        <ChannelsList
          channels={ channels }
          themes={ themes }
          actions={ actions }
        />
      </div>
    )
  }
}

ConfigApp.propTypes = {
  team: PropTypes.object.isRequired,
  channels: PropTypes.array.isRequired,
  themes: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  timeSetting: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
  return {
    team: state.team,
    channels: state.channels,
    themes: state.themes,
    timeSetting: state.timeSetting,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(configActions, dispatch),
  }
}


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfigApp)
