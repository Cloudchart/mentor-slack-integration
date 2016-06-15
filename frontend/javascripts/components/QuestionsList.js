import React, { Component, PropTypes } from 'react'


class QuestionsList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      questionIndex: props.userAnswers.length,
      answered: false,
    }
  }

  // handlers
  //
  handleNextClick() {
    if (this.state.questionIndex + 1 === this.props.questions.length) {
      window.location.reload()
    } else {
      this.setState({ answered: false, questionIndex: this.props.userAnswers.length })
    }

  }

  handleAnswerClick(answer, event) {
    if (this.state.answered) return

    this.props.actions.answerQuestion(answer.id).then(() => {
      this.setState({ answered: true })
    })
  }

  // renderers
  //
  renderAnswerStatus(answer) {
    const userAnswer = this.props.userAnswers.find(userAnswer => userAnswer.answerId === answer.id)

    if (userAnswer) {
      if (userAnswer.isCorrect) {
        return <i className="fa fa-check-circle-o"/>
      } else {
        return <i className="fa fa-times-circle-o"/>
      }
    } else {
      return <i className="fa fa-circle-o"/>
    }
  }

  renderAnswer(answer) {
    return (
      <li onClick={ this.handleAnswerClick.bind(this, answer) }>
        { this.renderAnswerStatus(answer) }
        <span>{ answer.name }</span>
      </li>
    )
  }

  render() {
    const { questions, userAnswers, actions } = this.props
    const { questionIndex, answered } = this.state
    const question = questions[questionIndex]

    return (
      <div>
        <div className="questions-counter">
          { `${questionIndex + 1}/${questions.length}` }
        </div>

        <div className="question">
          { question.name }
        </div>

        <ul className="answers">
          { question.answers.map(this.renderAnswer.bind(this)) }
        </ul>

        <button className="msi" onClick={ this.handleNextClick.bind(this) } disabled={ !answered }>
          Next
        </button>
      </div>
    )
  }

}

QuestionsList.propTypes = {
  survey: PropTypes.object.isRequired,
  questions: PropTypes.array.isRequired,
  userAnswers: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
}


export default QuestionsList
