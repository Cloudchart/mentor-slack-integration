import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { teamsActions } from '../actions'

import Header from '../components/Header'
import TeamsList from '../components/TeamsList'
import Footer from '../components/Footer'


class TeamsApp extends Component {

  render() {
    const { team, teams, actions } = this.props

    return (
      <div className="container teams">
        <Header team={ team } />

        <div className="content">
          <TeamsList teams={ teams } actions={ actions } />
        </div>

        <Footer/>
      </div>
    )
  }
}

TeamsApp.propTypes = {
  team: PropTypes.object.isRequired,
  teams: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
  return {
    team: state.team,
    teams: state.teams,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(teamsActions, dispatch),
  }
}


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TeamsApp)
