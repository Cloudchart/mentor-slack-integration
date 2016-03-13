import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { configActions } from '../actions'
import ChannelsList from '../components/ChannelsList'


class ConfigApp extends Component {

  render() {
    const { team, channels, themes, actions } = this.props

    return (
      <div>
        <h1>{ `Configure Virtual Mentor integration for ${team.name}` }</h1>
        <h2>Channels:</h2>
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
}

function mapStateToProps(state) {
  return {
    team: state.team,
    channels: state.channels,
    themes: state.themes,
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
