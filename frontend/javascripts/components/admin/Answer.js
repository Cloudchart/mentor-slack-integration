import React, { Component, PropTypes } from 'react'


class Answer extends Component {

  constructor(props) {
    super(props)
    this.state = {
      name: props.answer.name,
      isCorrect: props.answer.isCorrect,
    }
  }

  // helpers
  //
  getAttrs() {
    return {
      name: this.state.name,
      isCorrect: this.state.isCorrect,
    }
  }

  // handlers
  //
  handleInputChange(attr, event) {
    const value = attr === 'isCorrect' ? event.target.checked : event.target.value
    this.setState({ [attr]: value })
  }

  handleUpdate(event) {
    this.props.actions.updateAnswer(this.props.answer.id, this.getAttrs())
  }

  handleDestroy(event) {
    event.preventDefault()
    this.props.actions.destroyAnswer(this.props.answer.id)
  }

  // renderers
  //
  render() {
    return(
      <li>
        <input
          type="text"
          placeholder="Enter answer name"
          value={ this.state.name }
          onChange={ this.handleInputChange.bind(this, 'name') }
          onBlur={ this.handleUpdate.bind(this) }
        />
        <label>
          <input
            type="checkbox"
            checked={ this.state.isCorrect }
            onChange={ this.handleInputChange.bind(this, 'isCorrect') }
            onBlur={ this.handleUpdate.bind(this) }
          />
          <span>Correct</span>
        </label>
        <span> | </span>
        <a href="" onClick={ this.handleDestroy.bind(this) }>Destroy</a>
      </li>
    )
  }

}

Answer.propTypes = {
  actions: PropTypes.object.isRequired,
}


export default Answer
