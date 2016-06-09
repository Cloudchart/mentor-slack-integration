import React, { Component, PropTypes } from 'react'
import Question from './Question'


class QuestionsList extends Component {

  // helpers
  //
  getQuestions() {
    const { questions, survey } = this.props
    return questions.filter(question => question.surveyId === survey.id)
  }

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
    const { answers, actions } = this.props

    return (
      <div>
        <ul className="questions">
          {
            this.getQuestions().map(question => {
              return <Question question={ question } answers={ answers } actions={ actions } />
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
  answers: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
}


export default QuestionsList
