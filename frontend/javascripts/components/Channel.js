import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'

import { botName } from '../../data'


class Channel extends Component {

  // lifecycle
  //
  componentDidMount() {
    const { channel, themes } = this.props
    if (channel.status === 'invited' && !themes.find(item => item.channelId === channel.id)) {
      this.props.actions.fetchThemes(channel.id)
    }
  }

  // renderers
  //
  renderNotInvited(channel) {
    return channel.status === 'uninvited' ?
      <span className="description">{ `/invite @${botName} #${channel.name}` }</span> :
      null
  }

  renderSubscribedThemes(channel) {
    if (channel.status !== 'invited') return null
    const themes = this.props.themes.find(item => item.channelId === channel.id)

    if (themes && themes.items) {
      const subscribedThemes = themes.items.filter(theme => theme.isSubscribed)
      if (subscribedThemes.length > 0) {
        return (
          <span className="description">
            { subscribedThemes.map(theme => theme.name).join(', ') }
          </span>
        )
      } else {
        return null
      }
    } else {
      return null
    }
  }

  render() {
    const { channel } = this.props
    const iconClassNames = classNames('fa', 'fa-circle', channel.status)

    return (
      <li>
        <a href="" onClick={ this.props.onClick.bind(this, channel) }>
          <i className={ iconClassNames } />
          <span>{ `#${channel.name}` }</span>
        </a>
        { this.renderNotInvited(channel) }
        { this.renderSubscribedThemes(channel) }
      </li>
    )
  }

}

Channel.propTypes = {
  channel: PropTypes.object.isRequired,
  themes: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
}


export default Channel
