import React, { Component, PropTypes } from 'react'


class UsersList extends Component {

  // constructor(props) {
  //   super(props)
  //   this.state = {
  //   }
  // }

  // lifecycle
  //
  // conponentDidMount() {
  // }

  // componentWillReceiveProps(nextProps) {
  // }

  // handlers
  //

  // renderers
  //
  renderUser(user) {
    return (
      <li>{ user.real_name }</li>
    )
  }

  render() {
    const { viewedTeam, users } = this.props

    return (
      <div>
        <h2>{ `${viewedTeam.name} users:` }</h2>

        <ul className="users-list">
          { this.props.users.map(this.renderUser.bind(this)) }
        </ul>
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
