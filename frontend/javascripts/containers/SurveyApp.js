import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { surveyActions } from '../actions'

import Header from '../components/Header'
import QuestionsList from '../components/QuestionsList'
import Footer from '../components/Footer'


class SurveyApp extends Component {

  render() {
    const { survey, questions, userAnswers, actions } = this.props

    return (
      <div className="container survey">
        <Header type="plain" />

        <div className="content">
          <h1>
            <i className="fa fa-check-square"/>
            <span>{ `${survey.name} – Quiz` }</span>
          </h1>

          <QuestionsList
            survey={ survey }
            questions={ questions }
            userAnswers={ userAnswers }
            actions={ actions }
          />
        </div>

        <Footer/>
      </div>
    )
  }
}

SurveyApp.propTypes = {
  survey: PropTypes.object.isRequired,
  questions: PropTypes.array.isRequired,
  userAnswers: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
  return {
    survey: state.survey,
    questions: state.questions,
    userAnswers: state.userAnswers,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(surveyActions, dispatch),
  }
}


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SurveyApp)
