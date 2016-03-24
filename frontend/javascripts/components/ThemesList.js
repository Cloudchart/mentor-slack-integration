import React, { Component, PropTypes } from 'react'
import Modal from 'boron/FadeModal'
import classNames from 'classnames'


class ThemesList extends Component {

  // lifecycle
  //
  componentWillReceiveProps(nextProps) {
    if (nextProps.shouldRenderThemesList && nextProps.themes.items.length > 0) {
      // TODO: fork and add to source
      document.getElementById('modal').className = ''
      document.body.classList.add('opened-modal')

      this.refs.modal.show()
    }
  }

  // helpers
  //
  hideContainer() {
    // TODO: fork and add to source
    document.getElementById('modal').className = 'hidden'
    document.body.classList.remove('opened-modal')

    this.props.onHide()
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
    const { channel, actions } = this.props
    const selectedThemesSize = this.getSelectedThemesSize()
    if (selectedThemesSize === 3 && !theme.isSubscribed) return

    let action = theme.isSubscribed ? 'unsubscribe' : 'subscribe'
    actions.updateThemeStatus(theme.id, channel.id, action)

    if (selectedThemesSize === 0 && action === 'subscribe') {
      actions.createChannel(channel.id)
    } else if (selectedThemesSize === 1 && action === 'unsubscribe') {
      actions.destroyChannel(channel.id)
    }
  }

  // renderers
  //
  renderTheme(theme) {
    let iconClassNames = classNames('fa', 'fa-check', { 'is-fetching': theme.isFetching })

    return(
      <li onClick={ this.handleThemeClick.bind(this, theme) }>
        <span>{ theme.name }</span>
        { theme.isSubscribed || theme.isFetching ? <i className={ iconClassNames } /> : null }
      </li>
    )
  }

  render() {
    return (
      <div id="modal" className="hidden">
        <Modal ref="modal" onHide={ this.hideContainer.bind(this) }>
          <div className="modal-content themes-list">
            <h1>
              Choose topics you want Virtual Mentor to post
              to <strong>{ `#${this.props.channel.name}` }</strong>
            </h1>

            <ul>
              { this.props.themes.items.map(this.renderTheme.bind(this)) }
            </ul>

            <div className="actions">
              <button className="msi" onClick={ this.handleModalClose.bind(this) }>Done</button>
            </div>
          </div>
        </Modal>
      </div>
    )
  }

}

ThemesList.propTypes = {
  channel: PropTypes.object.isRequired,
  themes: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
}


export default ThemesList
