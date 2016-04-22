import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { teamUsersActions } from '../actions'

import Header from '../components/Header'
// import UsersList from '../components/admin/UsersList'
import Footer from '../components/Footer'


class TeamUsersApp extends Component {

  render() {
    const { team } = this.props

    return (
      <div className="container team-users">
        <Header team={ team } />

        <div className="content">
          Hello World
        </div>

        <Footer/>
      </div>
    )
  }
}

TeamUsersApp.propTypes = {
  team: PropTypes.object.isRequired,
  viewedTeam: PropTypes.object.isRequired,
  users: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
  return {
    viewedTeam: state.viewedTeam,
    team: state.team,
    users: state.users,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(teamUsersActions, dispatch),
  }
}


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TeamUsersApp)
