import React, { Component, PropTypes } from 'react'

import Header from '../components/Header'
import Privacy from '../components/pages/Privacy'
import Footer from '../components/Footer'


class PagesApp extends Component {

  renderPage() {
    switch (this.props.name) {
      case 'privacy':
        return <Privacy/>
      default:
        return null
    }
  }

  render() {
    return (
      <div className="container pages">
        <Header type={ 'plain' } />
        <div className="content">
          { this.renderPage() }
        </div>
        <Footer/>
      </div>
    )
  }

}

PagesApp.propTypes = {
  name: PropTypes.string.isRequired,
}


export default PagesApp
