import React, { Component, PropTypes } from 'react'
import Chat from './Chat'


class UsersList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedUserId: ''
    }
  }

  // lifecycle
  //
  // conponentDidMount() {
  // }

  // componentWillReceiveProps(nextProps) {
  // }

  // handlers
  //
  handleUserClick(user, event) {
    event.preventDefault()
    this.setState({ selectedUserId: user.id })
  }

  handleChatHide() {
    this.setState({ selectedUserId: '' })
  }

  // renderers
  //
  renderUser(user) {
    return (
      <li>
        <a href="" onClick={ this.handleUserClick.bind(this, user) }>{ user.real_name }</a>
      </li>
    )
  }

  render() {
    const { viewedTeam, users, actions } = this.props

    return (
      <div>
        <h2>{ `${viewedTeam.name} users:` }</h2>

        <ul className="users-list">
          { users.map(this.renderUser.bind(this)) }
        </ul>

        <Chat
          selectedUserId={ this.state.selectedUserId }
          users={ users }
          actions={ actions }
          onHide={ this.handleChatHide.bind(this) }
        />
      </div>
    )
  }

}

UsersList.propTypes = {
  viewedTeam: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
}


export default UsersList
