import React, { Component, PropTypes } from 'react'


class TeamsList extends Component {

  renderTeam(team) {
    return (
      <li>
        <a href={ `/admin/teams/${team.id}/users` }>{ team.name }</a>
      </li>
    )
  }

  render() {
    return (
      <div>
        <h2>Teams:</h2>

        <ul className="teams-list">
          { this.props.teams.map(this.renderTeam.bind(this)) }
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
