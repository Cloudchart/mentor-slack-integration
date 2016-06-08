import React, { Component, PropTypes } from 'react'
import QuestionsList from './QuestionsList'


class SurveysEdit extends Component {

  constructor(props) {
    super(props)
    const survey = this.getSurvey(props)
    this.state = {
      survey: survey,
      name: survey.name,
      isActive: survey.isActive,
    }
  }

  // lifecycle
  //
  componentWillReceiveProps(nextProps) {
    this.setState({ survey: this.getSurvey(nextProps) })
  }

  // helpers
  //
  getSurvey(props) {
    return props.surveys.find(survey => survey.id === props.id)
  }

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
    actions.updateSurvey(id, this.getAttributes())
  }

  // renderers
  //
  render() {
    const { questions, actions } = this.props
    const { survey } = this.state

    return (
      <div>
        <h2>{ `${survey.name} survey` }</h2>

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
          <button type="submit" className="msi" disabled={ !this.state.name || survey.isFetching }>
            Update
          </button>
        </form>

        <h2>Questions</h2>
        <QuestionsList survey={ survey } questions={ questions } actions={ actions } />
      </div>
    )
  }

}

SurveysEdit.propTypes = {
  id: PropTypes.string.isRequired,
  surveys: PropTypes.array.isRequired,
  questions: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  onUpdate: PropTypes.func,
}


export default SurveysEdit
