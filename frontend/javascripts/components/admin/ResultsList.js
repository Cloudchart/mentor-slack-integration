import React, { Component, PropTypes } from 'react'
import Result from './Result'


class ResultsList extends Component {

  // helpers
  //
  getResults() {
    const { survey, results } = this.props
    return results.filter(result => result.surveyId === survey.id)
  }

  // handlers
  //
  handleNew(event) {
    event.preventDefault()
    const { survey, actions } = this.props
    actions.createResult(survey.id)
  }

  // renderers
  //
  render() {
    const { actions } = this.props

    return (
      <div className="survey-results">
        <ul>
          {
            this.getResults().map(result => {
              return <Result result={ result } actions={ actions } />
            })
          }
        </ul>

        <a href="" onClick={ this.handleNew.bind(this) }>Add result</a>
      </div>
    )
  }

}

ResultsList.propTypes = {
  survey: PropTypes.object.isRequired,
  results: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
}


export default ResultsList
