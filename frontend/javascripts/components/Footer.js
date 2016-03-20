import React, { Component, PropTypes } from 'react'


class Footer extends Component {

  handleLinkClick(event) {
    event.preventDefault()
  }

  render() {
    return (
      <footer>
        <ul>
          <li>
            <a href="" onClick={ this.handleLinkClick.bind(this) }>Disclaimer</a>
          </li>
          <li>
            <a href="" onClick={ this.handleLinkClick.bind(this) }>Legal</a>
          </li>
          <li>
            <a href="" onClick={ this.handleLinkClick.bind(this) }>Contact</a>
          </li>
        </ul>
      </footer>
    )
  }

}


export default Footer
