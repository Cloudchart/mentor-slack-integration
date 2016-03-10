import React from 'react'
import ReactDOM from 'react-dom'
import Modal from 'boron/FadeModal'
import superagent from 'superagent'


export default class ThemesList extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      themes: [],
    }
  }

  // lifecycle
  //
  componentDidMount() {
    this.getInitialData()
  }

  componentWillUnmount() {
    this.initialRequest.abort()
    if (this.themeStatusRequest) this.themeStatusRequest.abort()
  }

  // requests
  //
  getInitialData() {
    this.initialRequest = superagent
      .get('/themes')
      .set('Accept', 'application/json')
      .query({ channelId: this.props.channelId })
      .end((err, res) => {
        if (err || !res.ok) {
          console.error(err)
        } else {
          this.setState(res.body)
          document.getElementById('modal').className = ''
          this.refs.modal.show()
        }
      })
  }

  updateThemeStatus(themeId, action) {
    this.themeStatusRequest = superagent
      .post('/themes')
      .set('Accept', 'application/json')
      .send({
        themeId: themeId,
        action: action,
        channelId: this.props.channelId,
        selectedThemesSize: this.getSelectedThemesSize(),
      })
      .end((err, res) => {
        if (err || !res.ok) {
          console.error(err)
        } else {
          // TODO: get data from the server and set state
        }
      })
  }

  // helpers
  //
  unmountModal() {
    let node = document.getElementById('modal')
    ReactDOM.unmountComponentAtNode(node)
    node.className = 'hidden'
  }

  getSelectedThemesSize() {
    return this.state.themes.filter(theme => theme.isSubscribed).length
  }

  // handlers
  //
  handleModalClose(event) {
    this.refs.modal.hide()
  }

  handleThemeClick(theme, event) {
    // TODO: update channel status

    event.preventDefault()
    if (this.getSelectedThemesSize() === 3 && !theme.isSubscribed) return

    let action = theme.isSubscribed ? 'unsubscribe' : 'subscribe'

    // temp optimistic update
    theme.isSubscribed = !theme.isSubscribed
    this.setState({ themes: this.state.themes })

    this.updateThemeStatus(theme.id, action)
  }

  // renderers
  //
  renderTheme(theme) {
    return(
      <li>
        <a href="" onClick={ this.handleThemeClick.bind(this, theme) }>{ theme.name }</a>
        { theme.isSubscribed ? <i className="fa fa-check"/> : null }
      </li>
    )
  }

  render() {
    return (
      <Modal ref="modal" onHide={ this.unmountModal }>
        <div className="modal-content">
          <ul>
            { this.state.themes.map(this.renderTheme.bind(this)) }
          </ul>
          <button onClick={ this.handleModalClose.bind(this) }>Close</button>
        </div>
      </Modal>
    )
  }

}

ThemesList.propTypes = {
  channelId: React.PropTypes.string.isRequired,
}
