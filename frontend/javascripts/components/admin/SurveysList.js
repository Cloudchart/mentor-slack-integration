import React, { Component, PropTypes } from 'react'
import { sortBy } from 'lodash'


class SurveysList extends Component {

  // handlers
  //
  handleRemove(id) {
    this.props.actions.destroySurvey(id)
  }

  // renderers
  //
  renderSurvey(survey) {
    return(
      <li>
        <span>{ survey.name }</span>
        <i className="fa fa-remove" onClick={ this.handleRemove.bind(this, survey.id) }/>
      </li>
    )
  }

  render() {
    const { surveys } = this.props

    return (
      <div>
        <h2>Surveys:</h2>

        <ul className="surveys-list">
          { sortBy(surveys, 'name').map(this.renderSurvey.bind(this)) }
        </ul>
      </div>
    )
  }

}

SurveysList.propTypes = {
  surveys: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
}


export default SurveysList
