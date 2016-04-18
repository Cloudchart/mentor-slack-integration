import _ from 'lodash'
import React, { Component, PropTypes } from 'react'
import TeamMessages from './TeamMessages'


class TeamChat extends Component {

  constructor(props) {
    super(props)
    this.state = {
      users: [],
    }
  }

  // lifecycle
  //
  componentDidMount() {
    this.props.actions.fetchTeamUsers(this.props.team.id)
  }

  componentWillReceiveProps(nextProps) {
    const users = nextProps.users.find(item => item.teamId === nextProps.team.id)
    this.setState({ users: users ? users.items : [] })
  }

  // handlers
  //
  handleBackClick(event) {
    event.preventDefault()
  }

  // renderers
  //
  renderUsersList() {
    const users = _
      .chain(this.state.users)
      .filter(user => user.name !== 'slackbot')
      .sortBy('real_name')

    return <ul>{ users.map(this.renderUser) }</ul>
  }

  renderUser(user) {
    let item = user.real_name
    if(user.is_primary_owner) item += ' (owner)'
    return <li>{ item }</li>
  }

  render() {
    const { team, users, messages, actions } = this.props

    return (
      <div>
        <h1>
          <i className="fa fa-slack" />
          <span>{ `Chat with ${team.name}` }</span>
        </h1>

        <h2>Users:</h2>
        { this.renderUsersList() }

        <h2>Chat:</h2>
        <TeamMessages team={ team } users={ users } messages={ messages } actions={ actions } />
        <textarea/>

        <div>
          <a href="" onClick={ this.handleBackClick.bind(this) }>Back</a>
        </div>
      </div>
    )
  }

}

TeamChat.propTypes = {
  team: PropTypes.object.isRequired,
  users: PropTypes.array.isRequired,
  messages: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
}


export default TeamChat
