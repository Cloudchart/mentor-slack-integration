import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'


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
  renderAnswerIcon(answer) {
    const userAnswer = this.props.userAnswers.find(userAnswer => userAnswer.answerId === answer.id)

    const iconClasses = classNames({
      unanswered: !this.state.answered,
      check: (userAnswer && userAnswer.isCorrect) || this.props.correctAnswers.includes(answer.id),
      times: userAnswer && !userAnswer.isCorrect,
    })

    return <i className={ iconClasses }/>
  }

  renderAnswer(answer) {
    return (
      <li onClick={ this.handleAnswerClick.bind(this, answer) }>
        { this.renderAnswerIcon(answer) }
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

        <p>
          { question.name }
          { answered ? question.explanation : null }
        </p>

        <ul className="answers">
          { question.answers.map(this.renderAnswer.bind(this)) }
        </ul>

        <div className="actions">
          <button
            className="msi next"
            onClick={ this.handleNextClick.bind(this) }
            disabled={ !answered }
          >
            Next
          </button>
        </div>
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
