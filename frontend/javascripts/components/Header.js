import React, { Component, PropTypes } from 'react'


class Header extends Component {

  handleLogout(event) {
    event.preventDefault()
    window.location = '/logout'
  }

  renderNav() {
    if (this.props.type === 'plain') return null

    return (
      <nav>
        <ul>
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


export default Header
