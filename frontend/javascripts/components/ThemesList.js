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
    this.themeStatusRequest.abort()
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

  updateThemeStatus(userThemeId, status) {
    this.themeStatusRequest = superagent
      .post('/themes')
      .set('Accept', 'application/json')
      .send({
        userThemeId: userThemeId,
        status: status,
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
    return this.state.themes.filter(theme => theme.status === 'subscribed').length
  }

  // handlers
  //
  handleModalClose(event) {
    this.refs.modal.hide()
  }

  handleThemeClick(userTheme, event) {
    event.preventDefault()
    let status = userTheme.status === 'subscribed' ? 'visible' : 'subscribed'

    // optimistic update
    userTheme.status = status
    this.setState({ themes: this.state.themes })

    this.updateThemeStatus(userTheme.id, status)
  }

  // renderers
  //
  renderTheme(theme) {
    return(
      <li>
        <a href="" onClick={ this.handleThemeClick.bind(this, theme) }>{ theme.name }</a>
        { theme.status === 'subscribed' ? <i className="fa fa-check"/> : null }
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
