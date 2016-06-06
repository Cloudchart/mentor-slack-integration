import React, { Component, PropTypes } from 'react'


class SurveysList extends Component {

  render() {
    const { surveys } = this.props

    return (
      <div>
        <h2>Surveys:</h2>

        <ul className="surveys-list">
          <li>yo</li>
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
