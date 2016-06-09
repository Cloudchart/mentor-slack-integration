import React, { Component, PropTypes } from 'react'
import Answer from './Answer'


class AnswersList extends Component {

  // helpers
  //
  getAnswers() {
    const { question, answers } = this.props
    return answers.filter(answer => answer.surveyQuestionId === question.id)
  }

  // handlers
  //
  handleCreateAnswer(event) {
    event.preventDefault()
    const { question, actions } = this.props
    actions.createAnswer(question.id)
  }

  // renderers
  //
  render() {
    const { actions } = this.props

    return (
      <div className="answers-list">
        <h3>Answers</h3>
        <ul>
         { this.getAnswers().map(answer => <Answer answer={ answer } actions={ actions } />) }
        </ul>
        <a href="" onClick={ this.handleCreateAnswer.bind(this) }>Add answer</a>
      </div>
    )
  }

}

AnswersList.propTypes = {
  question: PropTypes.object.isRequired,
  answers: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
}


export default AnswersList
