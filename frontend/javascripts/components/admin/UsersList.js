import React, { Component, PropTypes } from 'react'
import { chain } from 'lodash'
import { clean } from 'underscore.string'
import Chat from './Chat'
import Channel from '../Channel'


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

  handleChannelClick(channel, event) {
    event.preventDefault()
  }

  // renderers
  //
  renderUsersStatus() {
    return (
      this.props.users.length === 0 ?
      <span>Can't show any users. The team must have been kicked the bot.</span> :
      null
    )
  }

  renderUserStatus(user) {
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
        { this.renderUserStatus(user) }
      </li>
    )
  }

  render() {
    const { viewedTeam, users, messages, channels, themes, actions } = this.props

    return (
      <div>
        <h2>{ `${viewedTeam.name} users:` }</h2>

        <ul className="users-list">
          { this.renderUsersStatus() }

          {
            chain(users)
              .filter('hasNewMessage')
              .sortBy('name')
              .map(this.renderUser.bind(this))
          }

          {
            chain(users)
              .filter(user => user.hasLastTimestamp && !user.hasNewMessage)
              .sortBy('name')
              .map(this.renderUser.bind(this))
          }

          {
            chain(users)
              .filter(user => !user.hasLastTimestamp && !user.hasNewMessage)
              .sortBy('name')
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

        <h2>Channels:</h2>

        <ul className="channels-list">
          { channels.items.map(channel =>
            <Channel
              channel={ channel }
              themes={ themes }
              actions={ actions }
              onClick={ this.handleChannelClick.bind(this) }
            />
          )}
        </ul>
      </div>
    )
  }

}

UsersList.propTypes = {
  viewedTeam: PropTypes.object.isRequired,
  users: PropTypes.array.isRequired,
  channels: PropTypes.object.isRequired,
  themes: PropTypes.array.isRequired,
  messages: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
}


export default UsersList
