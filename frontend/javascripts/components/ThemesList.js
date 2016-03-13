import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import Modal from 'boron/FadeModal'
import classNames from 'classnames'


class ThemesList extends Component {

  // lifecycle
  //
  componentWillReceiveProps(nextProps) {
    if (nextProps.themes.items.length > 0) {
      document.getElementById('modal').className = ''
      this.refs.modal.show()
    }
  }

  // helpers
  //
  hideContainer() {
    document.getElementById('modal').className = 'hidden'
  }

  getSelectedThemesSize() {
    return this.props.themes.items.filter(theme => theme.isSubscribed).length
  }

  // handlers
  //
  handleModalClose(event) {
    this.refs.modal.hide()
  }

  handleThemeClick(theme, event) {
    event.preventDefault()
    const { channelId, actions } = this.props
    const selectedThemesSize = this.getSelectedThemesSize()
    if (selectedThemesSize === 3 && !theme.isSubscribed) return

    let action = theme.isSubscribed ? 'unsubscribe' : 'subscribe'
    actions.updateThemeStatus(theme.id, channelId, action)

    if (selectedThemesSize === 0 && action === 'subscribe') {
      // actions.createChannel(channelId)
    } else if (selectedThemesSize === 1 && action === 'unsubscribe') {
      // actions.destroyChannel(channelId)
    }
  }

  // renderers
  //
  renderTheme(theme) {
    let iconClassNames = classNames('fa', 'fa-check', { 'is-fetching': theme.isFetching })

    return(
      <li>
        <a href="" onClick={ this.handleThemeClick.bind(this, theme) }>{ theme.name }</a>
        { theme.isSubscribed || theme.isFetching ? <i className={ iconClassNames } /> : null }
      </li>
    )
  }

  render() {
    return (
      <div id="modal" className="hidden">
        <Modal ref="modal" onHide={ this.hideContainer }>
          <div className="modal-content">
            <ul className="themes-list">
              { this.props.themes.items.map(this.renderTheme.bind(this)) }
            </ul>
            <button onClick={ this.handleModalClose.bind(this) }>Close</button>
          </div>
        </Modal>
      </div>
    )
  }

}

ThemesList.propTypes = {
  channelId: PropTypes.string.isRequired,
  themes: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
}


export default ThemesList
