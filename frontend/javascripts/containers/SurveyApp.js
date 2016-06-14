import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { surveyActions } from '../actions'

import Header from '../components/Header'
import Footer from '../components/Footer'


class SurveyApp extends Component {

  render() {
    console.log(this.props);
    const { survey, questions, results, actions } = this.props

    return (
      <div className="container survey">
        <Header type="plain" />

        <div className="content">
          <h1>
            <i className="fa fa-check-square"/>
            <span>{ `${survey.name} – Quiz` }</span>
          </h1>

          <div className="questions-counter">
            { `1/${questions.length}` }
          </div>

          <div className="question">
            test
          </div>

          <ul className="answers">
            <li>1</li>
            <li>2</li>
            <li>3</li>
          </ul>

          <button className="msi">Next</button>
        </div>

        <Footer/>
      </div>
    )
  }
}

SurveyApp.propTypes = {
  survey: PropTypes.object.isRequired,
  questions: PropTypes.array.isRequired,
  results: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
  return {
    survey: state.survey,
    questions: state.questions,
    results: state.results,
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
