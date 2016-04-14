import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'


class TeamsList extends Component {

  // handlers
  //

  // renderers
  //
  renderTeam(team) {
    return <li>{ team.name }</li>
  }

  render() {
    const { teams } = this.props

    return (
      <div>
        <h2>Teams:</h2>

        <ul className="teams-list">
          { this.props.teams.map(this.renderTeam) }
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
