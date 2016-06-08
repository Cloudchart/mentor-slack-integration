import React, { Component, PropTypes } from 'react'


class SurveysForm extends Component {

  constructor(props) {
    super(props)
    const survey = props.surveys.find(survey => survey.id === props.id)

    this.state = {
      name: survey ? survey.name : '',
      isActive: survey ? survey.isActive : true,
      isFetching: false,
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
    const { id, actions, onSubmit } = this.props
    this.setState({ isFetching: true })

    if (id) {
      actions.updateSurvey(id, this.getAttributes()).then(() => {
        this.setState({ isFetching: false })
        onSubmit()
      })
    } else {
      actions.createSurvey(this.getAttributes()).then(() => {
        onSubmit()
        this.setState({ isFetching: false })
      })
    }
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
        <button type="submit" className="msi" disabled={ !this.state.name || this.state.isFetching }>
          { this.props.id ? 'Update' : 'Create' }
        </button>
      </form>
    )
  }

}

SurveysForm.propTypes = {
  id: PropTypes.string,
  surveys: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  onSubmit: PropTypes.func,
}


export default SurveysForm
