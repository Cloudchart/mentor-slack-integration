import React, { Component, PropTypes } from 'react'
import TeamChat from './TeamChat'


class TeamsList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedTeam: {},
    }
  }

  // handlers
  //
  handleTeamClick(team, event) {
    event.preventDefault()
    this.setState({ selectedTeam: team })
  }

  // renderers
  //
  renderTeam(team) {
    return (
      <li>
        <a href="" onClick={ this.handleTeamClick.bind(this, team) } >{ team.name }</a>
      </li>
    )
  }

  render() {
    const { teams, users, actions } = this.props

    if (Object.keys(this.state.selectedTeam).length > 0) {
      return <TeamChat team={ this.state.selectedTeam } users={ users } actions={ actions } />
    } else {
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

}

TeamsList.propTypes = {
  teams: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
}


export default TeamsList
