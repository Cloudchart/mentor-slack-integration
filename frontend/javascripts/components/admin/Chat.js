import React, { Component, PropTypes } from 'react'
import Modal from 'boron/FadeModal'


class Chat extends Component {

  constructor(props) {
    super(props)
    this.state = {
      user: {},
      messages: [],
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

    this.setState({ user: user })

    // TODO: fork and add to source
    document.getElementById('modal').className = ''
    document.body.classList.add('modal-opened')

    this.refs.modal.show()
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

  // renderers
  //
  renderMessage(message) {
    return null
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

            <ul>
              { this.state.messages.map(this.renderMessage.bind(this)) }
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

Chat.propTypes = {
  selectedUserId: PropTypes.string.isRequired,
  users: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
}


export default Chat
