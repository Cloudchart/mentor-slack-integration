import React, { Component, PropTypes } from 'react'
import { chain } from 'lodash'
import Chat from './Chat'


class UsersList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedUserId: ''
    }
  }

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
    let userName = user.real_name
    if (user.is_primary_owner) {
      userName += ' (primary owner)'
    } else if (user.is_owner) {
      userName += ' (owner)'
    }

    return (
      <li>
        <a href="" onClick={ this.handleUserClick.bind(this, user) }>{ userName }</a>
        { user.hasNewMessage ? <i className="fa fa-comment-o" /> : null }
      </li>
    )
  }

  render() {
    const { viewedTeam, users, messages, actions } = this.props

    return (
      <div>
        <h2>{ `${viewedTeam.name} users:` }</h2>

        <ul className="users-list">
          { chain(users).sortBy(['real_name', 'hasNewMessage']).map(this.renderUser.bind(this)) }
        </ul>

        <Chat
          selectedUserId={ this.state.selectedUserId }
          users={ users }
          messages={ messages }
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
  messages: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
}


export default UsersList
