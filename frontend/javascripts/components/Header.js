import React, { Component, PropTypes } from 'react'
import { slugify } from 'underscore.string'
import { ivcTeamId } from '../../data'


class Header extends Component {

  renderConfigurationLink() {
    return (
      /\/admin/.test(document.location.pathname) ?
      <li>
        <a href={ `/${slugify(this.props.team.name)}/configuration` }>Configuration</a>
      </li> :
      null
    )
  }

  renderTeamsLink() {
    return (
      this.props.team.isAdmin ?
      <li><a href="/admin/teams">Teams</a></li> :
      null
    )
  }

  renderNav() {
    if (this.props.type === 'plain') return null

    return (
      <nav>
        <ul>
          { this.renderConfigurationLink() }
          { this.renderTeamsLink() }
          <li>
            <a href="/logout">Logout</a>
          </li>
        </ul>
      </nav>
    )
  }

  render() {
    return (
      <header className="main">
        <a href="/" className="logo">
          <span className="main-logo"></span>
          <span>Mentor<strong>Bot</strong></span>
        </a>

        { this.renderNav() }
      </header>
    )
  }

}

Header.propTypes = {
  team: PropTypes.object.isRequired,
}


export default Header
