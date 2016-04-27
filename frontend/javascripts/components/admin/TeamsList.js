import React, { Component, PropTypes } from 'react'
import { chain } from 'lodash'


class TeamsList extends Component {

  renderStatus(team) {
    if (team.hasMessages) return <i className="fa fa-comment-o" />
    if (team.hasNewMessage) return <i className="fa fa-comment" />
    return null
  }

  renderTeam(team) {
    return (
      <li>
        <a href={ `/admin/teams/${team.id}/users` }>{ team.name }</a>
        { this.renderStatus(team) }
      </li>
    )
  }

  render() {
    return (
      <div>
        <h2>Teams:</h2>

        <ul className="teams-list">
          {
            chain(this.props.teams)
              .sortBy('hasMessages')
              .reverse()
              .sortBy('hasNewMessage')
              .reverse()
              .map(this.renderTeam.bind(this))
          }
        </ul>
      </div>
    )
  }

}

TeamsList.propTypes = {
  teams: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
}


export default TeamsList
