import React, { Component, PropTypes } from 'react'
import { chain } from 'lodash'


class TeamsList extends Component {

  renderTeam(team) {
    return (
      <li>
        { team.isAvailableForChat ? <a href={ `/admin/teams/${team.id}/users` }>{ team.name }</a> : team.name }
        { team.hasNewMessage ? <i className="fa fa-comment-o" /> : null }
      </li>
    )
  }

  render() {
    return (
      <div>
        <h2>Teams:</h2>

        <ul className="teams-list">
          { chain(this.props.teams).sortBy(['name', 'hasNewMessage']).map(this.renderTeam.bind(this)) }
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
