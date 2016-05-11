import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import { appName } from '../../data'


const buttonText = {
  telegram: <span>Add <strong>{ appName }</strong></span>,
  slack: <span>Add to <strong>Slack</strong></span>,
}


class BotButton extends Component {

  handleBotButtonClick(event) {
    window.location = this.props.url
  }

  render() {
    const { type, url, isTargetBlank, color } = this.props
    const buttonClassNames = classNames('bot-button', type, { [color]: color })

    return (
      <a href={ url } className={ buttonClassNames } target={ isTargetBlank ? '_blank' : '' }>
        <i/>
        { buttonText[type] }
      </a>
    )
  }

}

BotButton.propTypes = {
  type: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  isTargetBlank: PropTypes.bool,
  color: PropTypes.string,
}


export default BotButton
