import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { teamsActions } from '../actions'

import Header from '../components/Header'
import TeamsList from '../components/admin/TeamsList'
import Footer from '../components/Footer'


class TeamsApp extends Component {

  render() {
    const { team, teams, users, actions } = this.props

    return (
      <div className="container teams">
        <Header team={ team } />

        <div className="content">
          <TeamsList teams={ teams } users={ users } actions={ actions } />
        </div>

        <Footer/>
      </div>
    )
  }
}

TeamsApp.propTypes = {
  team: PropTypes.object.isRequired,
  teams: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
  return {
    team: state.team,
    teams: state.teams,
    users: state.users,
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
