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
  // conponentDidMount() {
  // }

  // componentWillReceiveProps(nextProps) {
  // }

  // handlers
  //
  handleInputChange(attr, event) {
    this.setState({ [attr]: event.target.value })
  }

  handleUpdate(event) {
    console.log('handleUpdate');
  }

  handleDestroy(event) {
    event.preventDefault()
    console.log('handleDestroy');
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
