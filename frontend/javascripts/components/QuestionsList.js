import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'


class QuestionsList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      questionIndex: props.userAnswers.length,
      answered: false,
      isFetching: false,
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

    this.setState({ isFetching: true })
    this.props.actions.answerQuestion(answer.id).then(() => {
      this.setState({ answered: true, isFetching: false })
    })
  }

  handleAnswerMouseEnter(event) {
    if (!this.state.answered && !this.state.isFetching) {
      event.target.firstChild.className = "fa fa-check-circle-o"
    }
  }

  handleAnswerMouseLeave(event) {
    if (!this.state.answered && !this.state.isFetching) {
      event.target.firstChild.className = "fa fa-circle-o"
    }
  }

  // renderers
  //
  renderAnswerStatus(answer) {
    const userAnswer = this.props.userAnswers.find(userAnswer => userAnswer.answerId === answer.id)
    const iconClasses = classNames('fa', {
      'fa-circle-o': !userAnswer,
      'fa-check-circle': userAnswer && userAnswer.isCorrect,
      'fa-times-circle': userAnswer && !userAnswer.isCorrect,
    })
    return <i ref="answerStatus" className={ iconClasses }/>
  }

  renderAnswer(answer) {
    return (
      <li
        onClick={ this.handleAnswerClick.bind(this, answer) }
        onMouseEnter={ this.handleAnswerMouseEnter.bind(this) }
        onMouseLeave={ this.handleAnswerMouseLeave.bind(this) }
      >
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

        <p>
          { question.name }
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
