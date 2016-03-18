import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { configActions } from '../actions'
import { getStartTimeRange, getEndTimeRange } from '../selectors'

import ChannelsList from '../components/ChannelsList'
import TimeSetting from '../components/TimeSetting'


class ConfigApp extends Component {

  render() {
    const {
      team,
      channels,
      themes,
      timeSetting,
      startTimeRange,
      endTimeRange,
      actions } = this.props

    return (
      <div id="configuration-container">
        <h1>
          <i className="fa fa-cogs" />
          <span>{ `Configure Virtual Mentor integration for ${team.name}` }</span>
        </h1>

        <TimeSetting
          timeSetting={ timeSetting }
          startTimeRange={ startTimeRange }
          endTimeRange={ endTimeRange }
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
  startTimeRange: PropTypes.array.isRequired,
  endTimeRange: PropTypes.array.isRequired,
}

function mapStateToProps(state) {
  return {
    team: state.team,
    channels: state.channels,
    themes: state.themes,
    timeSetting: state.timeSetting,
    startTimeRange: getStartTimeRange(state),
    endTimeRange: getEndTimeRange(state),
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
