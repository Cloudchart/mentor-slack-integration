import React, { Component, PropTypes } from 'react'


class Header extends Component {

  // handlers
  //
  handleLogout(event) {
    event.preventDefault()
    window.location = '/logout'
  }

  // renderers
  //
  renderBackLink() {
    return (
      /\/teams/.test(document.location.pathname) ?
      <li><a href={ document.referrer }><i className="fa fa-chevron-left" /></a></li> :
      null
    )
  }

  renderTeamsLink() {
    return (
      this.props.team.name === 'Insights.VC' ?
      <li><a href="/teams">Teams</a></li> :
      null
    )
  }

  renderNav() {
    if (this.props.type === 'plain') return null

    return (
      <nav>
        <ul>
          { this.renderBackLink() }
          { this.renderTeamsLink() }
          <li>
            <a href="" onClick={ this.handleLogout.bind(this) }>Logout</a>
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
