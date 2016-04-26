import React, { Component, PropTypes } from 'react'
import { chain } from 'lodash'
import { clean } from 'underscore.string'
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
  renderStatus(user) {
    if (user.hasNewMessage) return <i className="fa fa-comment" />
    if (user.hasLastTimestamp) return <i className="fa fa-comment-o" />
    return null
  }

  renderUser(user) {
    let userName = [user.name]
    userName.push(user.real_name)

    if (user.is_primary_owner) {
      userName.push('(primary owner)')
    } else if (user.is_owner) {
      userName.push('(owner)')
    }

    userName = clean(userName.join(' '))

    return (
      <li>
        <a href="" onClick={ this.handleUserClick.bind(this, user) }>{ userName }</a>
        { this.renderStatus(user) }
      </li>
    )
  }

  render() {
    const { viewedTeam, users, messages, actions } = this.props

    return (
      <div>
        <h2>{ `${viewedTeam.name} users:` }</h2>

        <ul className="users-list">
          {
            chain(users)
              .sortBy('hasLastTimestamp')
              .reverse()
              .sortBy('hasNewMessage')
              .reverse()
              .map(this.renderUser.bind(this))
          }
        </ul>

        <Chat
          selectedUserId={ this.state.selectedUserId }
          viewedTeam={ viewedTeam }
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
