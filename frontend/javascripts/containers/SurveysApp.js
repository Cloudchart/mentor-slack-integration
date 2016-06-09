import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Modal from 'boron/FadeModal'

import { surveysActions } from '../actions'

import Header from '../components/Header'
import SurveysList from '../components/admin/SurveysList'
import SurveysNew from '../components/admin/SurveysNew'
import Footer from '../components/Footer'


class SurveysApp extends Component {

  // handlers
  //
  handleNewClick(event) {
    event.preventDefault()
    this.refs.modal.show()
  }

  handleSurveyCreate() {
    this.refs.modal.hide()
  }

  // renderers
  //
  render() {
    const { team, surveys, questions, answers, actions } = this.props

    return (
      <div className="container surveys">
        <Header team={ team } />

        <div className="content">
          <SurveysList
            surveys={ surveys }
            questions={ questions }
            answers={ answers }
            actions={ actions }
          />

          <a href="" onClick={ this.handleNewClick.bind(this) }>New</a>
          <Modal ref="modal">
            <div className="modal-content surveys-new">
              <SurveysNew
                actions={ actions }
                onCreate={ this.handleSurveyCreate.bind(this) }
              />
            </div>
          </Modal>

        </div>

        <Footer/>
      </div>
    )
  }
}

SurveysApp.propTypes = {
  team: PropTypes.object.isRequired,
  surveys: PropTypes.array.isRequired,
  questions: PropTypes.array.isRequired,
  answers: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
  return {
    team: state.team,
    surveys: state.surveys,
    questions: state.questions,
    answers: state.answers,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(surveysActions, dispatch),
  }
}


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SurveysApp)
