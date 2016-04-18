import moment from 'moment'
import React, { Component, PropTypes } from 'react'
import { botName } from '../../../data'


class TeamMessages extends Component {

  constructor(props) {
    super(props)
    this.state = {
      messages: []
    }
  }

  // lifecycle
  //
  componentDidMount() {
    this.props.actions.fetchTeamMessages(this.props.team.id)
  }

  componentWillReceiveProps(nextProps) {
    const messages = nextProps.messages.find(item => item.teamId === nextProps.team.id)
    this.setState({ messages: messages ? messages.items : [] })
  }

  // handlers
  //

  // renderers
  //
  renderMessage(message) {
    const user = message.user
    const text = message.text
    const time = moment(parseInt(message.ts.split('.')[0] + '000')).format()

    return (
      <li>
        <strong>{ user }</strong> |
        <span>{ time }</span>
        <div>{ text }</div>
      </li>
    )
  }

  render() {
    return (
      <div>
        <ul>{ this.state.messages.map(this.renderMessage) }</ul>
      </div>
    )
  }

}

TeamMessages.propTypes = {
  team: PropTypes.object.isRequired,
  users: PropTypes.array.isRequired,
  messages: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
}


export default TeamMessages
