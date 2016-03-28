import React, { Component, PropTypes } from 'react'
import Modal from 'boron/FadeModal'
import classNames from 'classnames'


class ThemesList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      themes: [],
      isThemesUpdated: false,
    }
  }

  // lifecycle
  //
  shouldComponentUpdate(nextProps, nextState) {
    return Object.keys(nextProps.channel).length > 0
  }

  componentWillReceiveProps(nextProps) {
    if (Object.keys(nextProps.channel).length > 0) {
      const themes = nextProps.themes.find(item => item.channelId === nextProps.channel.id)

      if (themes) {
        this.setState({ themes: themes.items, isThemesUpdated: false })
        // TODO: fork and add to source
        document.getElementById('modal').className = ''
        document.body.classList.add('modal-opened')

        this.refs.modal.show()
      } else {
        nextProps.actions.fetchThemes(nextProps.channel.id)
      }
    }
  }

  // helpers
  //
  getSelectedThemesSize() {
    return this.state.themes.filter(theme => theme.isSubscribed).length
  }

  notifyChannel() {
    if (
      this.props.channel.status !== 'invited' ||
      this.getSelectedThemesSize() === 0 ||
      !this.state.isThemesUpdated
    ) return

    this.props.actions.notifyChannel(this.props.channel.id)
  }

  // handlers
  //
  handleModalHide() {
    // TODO: fork and add to source
    document.getElementById('modal').className = 'hidden'
    document.body.classList.remove('modal-opened')

    this.notifyChannel()
    this.props.onHide()
  }

  handleModalClose(event) {
    this.refs.modal.hide()
  }

  handleThemeClick(theme, event) {
    event.preventDefault()
    const { channel, actions } = this.props
    const selectedThemesSize = this.getSelectedThemesSize()
    if (selectedThemesSize === 3 && !theme.isSubscribed) return

    let action = theme.isSubscribed ? 'unsubscribe' : 'subscribe'
    actions.updateThemeStatus(theme.id, channel.id, action).then(() => {
      this.setState({ isThemesUpdated: true })
    })

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
        <Modal ref="modal" onHide={ this.handleModalHide.bind(this) }>
          <div className="modal-content themes-list">
            <h1>
              Choose topics you want Virtual Mentor to post
              to <strong>{ `#${this.props.channel.name}` }</strong>
            </h1>

            <ul>
              { this.state.themes.map(this.renderTheme.bind(this)) }
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
  themes: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
}


export default ThemesList
