import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { usersActions } from '../actions'

import Header from '../components/Header'
import UsersList from '../components/admin/UsersList'
import Footer from '../components/Footer'


class UsersApp extends Component {

  render() {
    const { team, viewedTeam, users, messages, actions } = this.props

    return (
      <div className="container users">
        <Header team={ team } />

        <div className="content">
          <UsersList
            viewedTeam={ viewedTeam }
            users={ users }
            messages={ messages }
            actions={ actions }
          />
        </div>

        <Footer/>
      </div>
    )
  }
}

UsersApp.propTypes = {
  team: PropTypes.object.isRequired,
  viewedTeam: PropTypes.object.isRequired,
  users: PropTypes.array.isRequired,
  messages: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
  return {
    viewedTeam: state.viewedTeam,
    team: state.team,
    users: state.users,
    messages: state.messages,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(usersActions, dispatch),
  }
}


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UsersApp)
