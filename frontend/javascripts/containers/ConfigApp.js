import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { configActions } from '../actions'
import { getStartTimeRange, getEndTimeRange } from '../selectors'

import Header from '../components/Header'
import Footer from '../components/Footer'
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
        <Header/>

        <div className="content">
          <h1>
            <i className="fa fa-cogs" />
            Configure Virtual Mentor integration for <strong>{ team.name }</strong>
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

        <Footer/>
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
