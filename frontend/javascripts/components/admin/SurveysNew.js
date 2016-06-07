import React, { Component, PropTypes } from 'react'


class SurveysNew extends Component {

  constructor(props) {
    super(props)
    this.state = {
      name: '',
      isActive: true,
    }
  }

  // helpers
  //
  getAttributes() {
    return {
      name: this.state.name,
      isActive: this.state.isActive,
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
    const value = attr === 'isActive' ? event.target.checked : event.target.value
    this.setState({ [attr]: value })
  }

  handleSubmit(event) {
    event.preventDefault()
    this.props.actions.createSurvey(this.getAttributes()).then(() => this.props.onCreate())
  }

  // renderers
  //
  render() {
    return (
      <form onSubmit={ this.handleSubmit.bind(this) }>
        <label>
          <span>Name</span>
          <input
            type="text"
            autoFocus={ true }
            value={ this.state.name }
            placeholder={ 'Enter survey name' }
            onChange={ this.handleInputChange.bind(this, 'name') }
          />
        </label>
        <label>
          <input
            type="checkbox"
            checked={ this.state.isActive }
            onChange={ this.handleInputChange.bind(this, 'isActive') }
          />
          <span>Active</span>
        </label>
        <button type="submit" className="msi" disabled={ !this.state.name }>
          Create
        </button>
      </form>
    )
  }

}

SurveysNew.propTypes = {
  actions: PropTypes.object.isRequired,
  onCreate: PropTypes.func,
}


export default SurveysNew
