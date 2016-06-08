import React, { Component, PropTypes } from 'react'
import Question from './Question'


class QuestionsList extends Component {

  // handlers
  //
  handleCreateQuestion(event) {
    event.preventDefault()
    const { survey, actions } = this.props
    actions.createQuestion(survey.id)
  }

  // renderers
  //
  render() {
    const { actions } = this.props

    return (
      <div>
        <ul className="questions">
          {
            this.props.questions.map(question => {
              return <Question question={ question } actions={ actions } />
            })
          }
        </ul>
        <a href="" onClick={ this.handleCreateQuestion.bind(this) }>Add question</a>
      </div>
    )
  }

}

QuestionsList.propTypes = {
  survey: PropTypes.object.isRequired,
  questions: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
}


export default QuestionsList
