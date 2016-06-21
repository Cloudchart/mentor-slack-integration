import React, { Component, PropTypes } from 'react'
import AnswersList from './AnswersList'


class Question extends Component {

  constructor(props) {
    super(props)
    this.state = {
      name: props.question.name,
      explanation: props.question.explanation,
    }
  }

  // lifecycle
  //
  componentWillReceiveProps(nextProps) {
    this.setState({
      name: nextProps.question.name,
      explanation: nextProps.question.explanation,
    })
  }

  // helpers
  //
  getAttrs() {
    return {
      name: this.state.name,
      explanation: this.state.explanation,
    }
  }

  // handlers
  //
  handleInputChange(attr, event) {
    this.setState({ [attr]: event.target.value })
  }

  handleUpdate(event) {
    this.props.actions.updateQuestion(this.props.question.id, this.getAttrs())
  }

  handleDestroy(event) {
    event.preventDefault()
    if (window.confirm('Are you sure?')) this.props.actions.destroyQuestion(this.props.question.id)
  }

  // renderers
  //
  render() {
    const { question, answers, actions } = this.props

    return (
      <li>
        <textarea
          placeholder="Enter question name"
          value={ this.state.name }
          onChange={ this.handleInputChange.bind(this, 'name') }
          onBlur={ this.handleUpdate.bind(this) }
        />
        <span> | </span>
        <textarea
          placeholder="Enter question explanation"
          value={ this.state.explanation }
          onChange={ this.handleInputChange.bind(this, 'explanation') }
          onBlur={ this.handleUpdate.bind(this) }
        />
        <span> | </span>
        <a href="" onClick={ this.handleDestroy.bind(this) }>Destroy</a>
        <AnswersList question={ question } answers={ answers } actions={ actions } />
      </li>
    )
  }

}

Question.propTypes = {
  question: PropTypes.object.isRequired,
  answers: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
}


export default Question
