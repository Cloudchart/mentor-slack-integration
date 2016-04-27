import moment from 'moment'
import Modal from 'boron/FadeModal'
import React, { Component, PropTypes } from 'react'
import { botName } from '../../../data'

const availabilityStatuses = {
  default: "The team isn't available for chat. You can enqueue the message. This cannot be undone.",
  enqueued: "Ok. Chat message has been enqueued.",
  notEnqueued: "Hey. You have already enqueued this message.",
}

class Chat extends Component {

  constructor(props) {
    super(props)
    this.state = {
      user: {},
      messages: [],
      text: '',
      syncInterval: null,
      isFetching: false,
      availabilityStatus: availabilityStatuses.default,
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
        messages: messages.items,
        isFetching: messages.isFetching,
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
  handleModalShow() {
    this.setState({
      syncInterval: setInterval(() => {
        this.props.actions.fetchMessages(this.state.user.id)
      }, 15000)
    })
  }

  handleModalHide() {
    // TODO: fork and add to source
    document.getElementById('modal').className = 'hidden'
    document.body.classList.remove('modal-opened')

    clearInterval(this.state.syncInterval)

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
    if (!this.state.text || this.state.isFetching) return
    this.setState({ text: '' })

    this.props.actions.postMessage(this.state.user.id, this.state.text).then(json => {
      if (json.message === 'enqueued') {
        this.setState({ availabilityStatus: availabilityStatuses.enqueued })
      } else if (json.message === 'not enqueued') {
        this.setState({ availabilityStatus: availabilityStatuses.notEnqueued })
      } else {
        this.props.actions.fetchMessages(this.state.user.id)
      }
    })
  }

  // renderers
  //
  renderMessagesStatus() {
    if (this.state.messages.length === 0) return <span>There are no messages here.</span>
    return null
  }

  renderAvailabilityStatus() {
    return(
      !this.props.viewedTeam.isAvailableForChat ?
      <span>{ this.state.availabilityStatus }</span> :
      null
    )
  }

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
        <Modal ref="modal" onShow={ this.handleModalShow.bind(this) } onHide={ this.handleModalHide.bind(this) }>
          <div className="modal-content chat">
            <h1>
              <span>Chat with </span>
              <strong>{ this.state.user.real_name || this.state.user.name }</strong>
            </h1>

            <ul className="chat-window">
              { this.renderMessagesStatus() }
              { this.state.messages.map(this.renderMessage.bind(this)) }
            </ul>

            <div className="actions">
              <form onSubmit={ this.handleFormSubmit.bind(this) }>
                <input
                  type="text"
                  autoFocus={ true }
                  value={ this.state.text }
                  onChange={ this.handleInputChange.bind(this) }
                />

                <button type="submit" className="msi" disabled={ this.state.isFetching || !this.props.viewedTeam.isAvailableForChat  }>
                  Send
                </button>
              </form>
              { this.renderAvailabilityStatus() }
            </div>
          </div>
        </Modal>
      </div>
    )
  }

}

Chat.propTypes = {
  selectedUserId: PropTypes.string.isRequired,
  viewedTeam: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired,
  messages: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
}


export default Chat
