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
    this.serverRequest = superagent
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

  componentWillUnmount() {
    this.serverRequest.abort()
  }

  // helpers
  //
  unmountModal() {
    let node = document.getElementById('modal')
    ReactDOM.unmountComponentAtNode(node)
    node.className = 'hidden'
  }

  // handlers
  //
  handleModalClose(event) {
    this.refs.modal.hide()
  }

  // renderers
  //
  renderTheme(theme) {
    return(
      <li>{ `${theme.name} — ${theme.status}` }</li>
    )
  }

  render() {
    return (
      <Modal ref="modal" onHide={ this.unmountModal }>
        <ul>
          { this.state.themes.map(this.renderTheme.bind(this)) }
        </ul>
        <button onClick={ this.handleModalClose.bind(this) }>Close</button>
      </Modal>
    )
  }

}

ThemesList.propTypes = {
  channelId: React.PropTypes.string.isRequired,
}
