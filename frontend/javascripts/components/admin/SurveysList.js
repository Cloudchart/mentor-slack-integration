import React, { Component, PropTypes } from 'react'
import Modal from 'boron/FadeModal'
import { sortBy } from 'lodash'
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
  handleEdit(id, event) {
    event.preventDefault()
    this.setState({ selectedSurveyId: id })
    this.refs.modal.show()
  }

  handleUpdate() {
    this.refs.modal.hide()
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
        { survey.isActive ? <i className="fa fa-check"/> : <i className="fa fa-times"/> }
        <span> | </span>
        <a href="" onClick={ this.handleEdit.bind(this, survey.id) }>Edit</a>
        <span> | </span>
        <a href="" onClick={ this.handleDestroy.bind(this, survey.id) }>Destroy</a>
      </li>
    )
  }

  render() {
    const { surveys, questions, answers, actions } = this.props

    return (
      <div>
        <h2>Surveys</h2>

        <ul className="surveys-list">
          { sortBy(surveys, survey => survey.name.toLowerCase()).map(this.renderSurvey.bind(this)) }
        </ul>

        <Modal ref="modal">
          <div className="modal-content surveys-edit">
            <SurveysEdit
              id={ this.state.selectedSurveyId }
              surveys={ surveys }
              questions={ questions }
              answers={ answers }
              actions={ actions }
              onUpdate={ this.handleUpdate.bind(this) }
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
  actions: PropTypes.object.isRequired,
}


export default SurveysList
