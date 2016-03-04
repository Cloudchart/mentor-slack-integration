import React from 'react'
import ChannelsList from './ChannelsList'

export default class ConfigApp extends React.Component {

  render() {
    return (
      <div className="container">
        <h1>{ `Configure Virtual Mentor integration for ${this.props.teamName}` }</h1>
        <h2>Channels:</h2>
        <ChannelsList/>
      </div>
    )
  }

}
