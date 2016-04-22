import moment from 'moment'
import Modal from 'boron/FadeModal'
import React, { Component, PropTypes } from 'react'
import { botName } from '../../../data'


class Chat extends Component {

  constructor(props) {
    super(props)
    this.state = {
      user: {},
      messages: [],
      text: '',
    }
  }

  // lifecycle
  //
  shouldComponentUpdate(nextProps, nextState) {
    return !!nextProps.selectedUserId
  }

  componentWillReceiveProps(nextProps) {
    const user = nextProps.users.find(user => user.id === nextProps.selectedUserId)
    if (!user) return

    const messages = nextProps.messages.find(item => item.userId === user.id)

    if (messages) {
      this.setState({
        user: user,
        messages: messages.items
      })

      // TODO: fork and add to source
      document.getElementById('modal').className = ''
      document.body.classList.add('modal-opened')

      this.refs.modal.show()
    } else {
      nextProps.actions.fetchMessages(user.id)
    }
  }

  // handlers
  //
  handleModalHide() {
    // TODO: fork and add to source
    document.getElementById('modal').className = 'hidden'
    document.body.classList.remove('modal-opened')

    this.props.onHide()
  }

  handleModalClose(event) {
    this.refs.modal.hide()
  }

  handleInputChange(event) {
    this.setState({ text: event.target.value })
  }

  handleFormSubmit(event) {
    event.preventDefault()
    if (!this.state.text) return
    this.props.actions.postMessage(this.state.user.id, this.state.text).then(() => {
      this.setState({ text: '' })
      this.props.actions.fetchMessages(this.state.user.id)
    })
  }

  handleRefreshClick(event) {
    this.props.actions.fetchMessages(this.state.user.id)
  }

  // renderers
  //
  renderMessage(message) {
    const user = message.user === this.state.user.id ? this.state.user.name : botName
    const text = message.text
    const time = moment(parseInt(message.ts.split('.')[0] + '000')).fromNow()

    return (
      <li>
        <strong className="username">{ user }</strong>
        <span>{ time }</span>
        <div>{ text }</div>
      </li>
    )
  }

  render() {
    return (
      <div id="modal" className="hidden">
        <Modal ref="modal" onHide={ this.handleModalHide.bind(this) }>
          <div className="modal-content chat">
            <h1>
              <span>Chat with </span>
              <strong>{ this.state.user.real_name }</strong>
            </h1>

            <ul className="chat-window">
              { this.state.messages.map(this.renderMessage.bind(this)) }
            </ul>

            <div className="actions">
              <form onSubmit={ this.handleFormSubmit.bind(this) }>
                <input type="text" value={ this.state.text } onChange={ this.handleInputChange.bind(this) } />
                <input type="submit" value="Send" />
              </form>
              <button onClick={ this.handleRefreshClick.bind(this) }>Refresh</button>
            </div>
          </div>
        </Modal>
      </div>
    )
  }

}

Chat.propTypes = {
  selectedUserId: PropTypes.string.isRequired,
  users: PropTypes.object.isRequired,
  messages: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
}


export default Chat
