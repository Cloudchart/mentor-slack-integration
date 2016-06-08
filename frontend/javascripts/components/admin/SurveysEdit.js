import React, { Component, PropTypes } from 'react'


class SurveysEdit extends Component {

  constructor(props) {
    super(props)
    const survey = props.surveys.find(survey => survey.id === props.id)

    this.state = {
      survey: survey,
      name: survey.name,
      isActive: survey.isActive,
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

  // handlers
  //
  handleInputChange(attr, event) {
    const value = attr === 'isActive' ? event.target.checked : event.target.value
    this.setState({ [attr]: value })
  }

  handleSubmit(event) {
    event.preventDefault()
    const { id, actions, onUpdate } = this.props
    actions.updateSurvey(id, this.getAttributes()).then(() => onUpdate())
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
        <button type="submit" className="msi" disabled={ !this.state.name || this.state.survey.isFetching }>
          Update
        </button>
      </form>
    )
  }

}

SurveysEdit.propTypes = {
  id: PropTypes.string.isRequired,
  surveys: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  onUpdate: PropTypes.func,
}


export default SurveysEdit
