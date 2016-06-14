import React, { Component, PropTypes } from 'react'


class QuestionsList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      questionIndex: props.userAnswers.length,
    }
  }

  // lifecycle
  //
  // conponentDidMount() {
  // }

  // componentWillReceiveProps(nextProps) {
  // }

  // handlers
  //
  handleNextClick() {
    console.log('handleNextClick');
  }

  handleAnswerClick(answer, event) {
    console.log('handleAnswerClick', answer);
    // this.props.actions.answerQuestion(answer.id)
  }

  // renderers
  //
  renderAnswer(answer) {
    return (
      <li onClick={ this.handleAnswerClick.bind(this, answer) }>
        <i className="fa fa-circle-o"/>
        <span>{ answer.name }</span>
      </li>
    )
  }

  render() {
    const { questions, userAnswers, actions } = this.props
    const question = questions[this.state.questionIndex]

    return (
      <div>
        <div className="questions-counter">
          { `${this.state.questionIndex + 1}/${questions.length}` }
        </div>

        <div className="question">
          { question.name }
        </div>

        <ul className="answers">
          { question.answers.map(this.renderAnswer.bind(this)) }
        </ul>

        <button className="msi" onClick={ this.handleNextClick.bind(this) } disabled={ true }>
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
