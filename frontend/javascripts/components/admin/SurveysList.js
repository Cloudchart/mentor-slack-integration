import React, { Component, PropTypes } from 'react'
import Modal from 'boron/FadeModal'
import { sortBy } from 'lodash'

import SurveysNew from './SurveysNew'
import SurveysEdit from './SurveysEdit'


class SurveysList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedSurveyId: null,
    }
  }

  // handlers
  //
  handleNew(event) {
    event.preventDefault()
    this.refs.modal.show()
  }

  handleCreate() {
    this.refs.modal.hide()
  }

  handleEdit(id, event) {
    event.preventDefault()
    this.setState({ selectedSurveyId: id })
  }

  handleReturn() {
    this.setState({ selectedSurveyId: null })
  }

  handleDestroy(id, event) {
    event.preventDefault()
    if (window.confirm('Are you sure?')) this.props.actions.destroySurvey(id)
  }

  // renderers
  //
  renderSurvey(survey) {
    return(
      <li>
        <span>{ survey.name }</span>
        <span> | </span>
        <span>{ survey.slug }</span>
        <span> | </span>
        { survey.isActive ? <i className="fa fa-check"/> : <i className="fa fa-times"/> }
        <span> | </span>
        <a href="" onClick={ this.handleEdit.bind(this, survey.id) }>Edit</a>
        <span> | </span>
        <a href="" onClick={ this.handleDestroy.bind(this, survey.id) }>Destroy</a>
      </li>
    )
  }

  render() {
    const { surveys, questions, answers, results, actions } = this.props

    if (this.state.selectedSurveyId) return (
      <SurveysEdit
        id={ this.state.selectedSurveyId }
        surveys={ surveys }
        questions={ questions }
        answers={ answers }
        results={ results }
        actions={ actions }
        onReturn={ this.handleReturn.bind(this) }
      />
    )

    return (
      <div>
        <h2>Surveys</h2>

        <ul className="surveys-list">
          { sortBy(surveys, survey => survey.name.toLowerCase()).map(this.renderSurvey.bind(this)) }
        </ul>

        <a href="" onClick={ this.handleNew.bind(this) }>New</a>
        <Modal ref="modal">
          <div className="modal-content surveys-new">
            <SurveysNew
              actions={ actions }
              onCreate={ this.handleCreate.bind(this) }
            />
          </div>
        </Modal>
      </div>
    )
  }

}

SurveysList.propTypes = {
  surveys: PropTypes.array.isRequired,
  questions: PropTypes.array.isRequired,
  answers: PropTypes.array.isRequired,
  results: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
}


export default SurveysList
