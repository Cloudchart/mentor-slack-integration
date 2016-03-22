import React, { Component, PropTypes } from 'react'


class Header extends Component {

  handleLogout(event) {
    event.preventDefault()
    window.location = '/logout'
  }

  render() {
    return (
      <header className="main">
        <div className="logo">
          <span className="main-logo"></span>
          <span>Virtual <strong>Mentor</strong></span>
        </div>

        <nav>
          <ul>
            <li>
              <a href="" onClick={ this.handleLogout.bind(this) }>Logout</a>
            </li>
          </ul>
        </nav>
      </header>
    )
  }

}


export default Header
