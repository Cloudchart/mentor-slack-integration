import React, { Component, PropTypes } from 'react'


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
    this.props.actions.fetchTeamChat(this.props.team.id)
  }

  // handlers
  //
  handleBackClick(event) {
    event.preventDefault()
  }

  // renderers
  //
  renderUser(user) {
    return (
      <li>
        { `${user.real_name}` }
      </li>
    )
  }

  render() {
    const { team } = this.props
    let users = this.props.users.find(item => item.teamId === team.id)
    users = users ? users.items : []

    return (
      <div>
        <h1>
          <i className="fa fa-slack" />
          <span>{ `Chat with ${team.name}` }</span>
        </h1>

        <h2>Users:</h2>
        <div>Owner: Owner1</div>
        <ul>{ users.map(this.renderUser.bind(this)) }</ul>

        <h2>Chat:</h2>
        <div>history...</div>
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
  actions: PropTypes.object.isRequired,
}


export default TeamChat
