import React, { Component, PropTypes } from 'react'
import { chain } from 'lodash'


class TeamsList extends Component {

  renderStatus(team) {
    if (team.hasNewMessage) return <i className="fa fa-comment" />
    if (team.hasMessages) return <i className="fa fa-comment-o" />
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
    const { teams } = this.props

    return (
      <div>
        <h2>Teams:</h2>

        <ul className="teams-list">
          {
            chain(teams)
              .filter('hasNewMessage')
              .sortBy('name')
              .map(this.renderTeam.bind(this))
          }

          {
            chain(teams)
              .filter(team => team.hasMessages && !team.hasNewMessage)
              .sortBy('name')
              .map(this.renderTeam.bind(this))
          }

          {
            chain(teams)
              .filter(team => !team.hasMessages && !team.hasNewMessage)
              .sortBy('name')
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
