import React from 'react'
import ReactDOM from 'react-dom'
import Modal from 'simple-react-modal'
import superagent from 'superagent'


export default class ThemesList extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      themes: [],
      showModal: true,
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
       }
     })
  }

  componentWillUnmount() {
    this.serverRequest.abort()
  }

  // handlers
  //
  handleModalClose(event) {
    this.setState({ showModal: false })
    ReactDOM.unmountComponentAtNode(document.getElementById('modal'))
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
      <Modal show={ this.state.showModal } onClose={ this.handleModalClose.bind(this) }>
        <ul>
          { this.state.themes.map(this.renderTheme.bind(this)) }
        </ul>
      </Modal>
    )
  }

}

ThemesList.propTypes = {
  channelId: React.PropTypes.string.isRequired,
}
