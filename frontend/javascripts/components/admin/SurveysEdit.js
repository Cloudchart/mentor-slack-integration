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

  handleUpdate(event) {
    const { id, actions } = this.props
    actions.updateSurvey(id, this.getAttributes())
  }

  handleOkClick(event) {
    this.props.onUpdate()
  }

  // renderers
  //
  render() {
    const { questions, answers, actions } = this.props
    const { survey } = this.state

    return (
      <div className="surveys-edit">
        <h2>{ `${survey.name} survey` }</h2>

        <form>
          <label>
            <span>Name</span>
            <input
              type="text"
              autoFocus={ true }
              value={ this.state.name }
              placeholder={ 'Enter survey name' }
              onChange={ this.handleInputChange.bind(this, 'name') }
              onBlur={ this.handleUpdate.bind(this) }
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={ this.state.isActive }
              onChange={ this.handleInputChange.bind(this, 'isActive') }
              onBlur={ this.handleUpdate.bind(this) }
            />
            <span>Active</span>
          </label>
        </form>

        <h2>Questions</h2>
        <QuestionsList
          survey={ survey }
          questions={ questions }
          answers={ answers }
          actions={ actions }
        />

        <div className="actions">
          <button className="msi" onClick={ this.handleOkClick.bind(this) }>
            Ok
          </button>
        </div>
      </div>
    )
  }

}

SurveysEdit.propTypes = {
  id: PropTypes.string.isRequired,
  surveys: PropTypes.array.isRequired,
  questions: PropTypes.array.isRequired,
  answers: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  onUpdate: PropTypes.func,
}


export default SurveysEdit
