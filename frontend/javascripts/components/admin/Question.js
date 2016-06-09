import React, { Component, PropTypes } from 'react'


class Question extends Component {

  constructor(props) {
    super(props)
    this.state = {
      name: props.question.name,
    }
  }

  // lifecycle
  //
  componentWillReceiveProps(nextProps) {
    this.setState({ name: nextProps.question.name })
  }

  // helpers
  //
  getAttrs() {
    return {
      name: this.state.name
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
    this.props.actions.destroyQuestion(this.props.question.id)
  }

  // renderers
  //
  render() {
    return (
      <li>
        <input
          type="text"
          placeholder="Enter question name"
          value={ this.state.name }
          onChange={ this.handleInputChange.bind(this, 'name') }
          onBlur={ this.handleUpdate.bind(this) }
        />
        <span> | </span>
        <a href="" onClick={ this.handleDestroy.bind(this) }>Destroy</a>
      </li>
    )
  }

}

Question.propTypes = {
  question: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
}


export default Question
