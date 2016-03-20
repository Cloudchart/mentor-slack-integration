import React, { Component, PropTypes } from 'react'


class Header extends Component {

  handleLinkClick(event) {
    event.preventDefault()
  }

  render() {
    return (
      <header className="main">
        <div className="logo">
          <span className="main-logo"></span>
          <span>Virtual <strong>Mentor</strong></span>
        </div>
      </header>
    )
  }

}


export default Header
