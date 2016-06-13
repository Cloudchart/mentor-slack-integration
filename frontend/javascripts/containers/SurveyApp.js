import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { surveyActions } from '../actions'

import Header from '../components/Header'
// import SurveysList from '../components/admin/SurveysList'
import Footer from '../components/Footer'


class SurveyApp extends Component {

  render() {
    const { survey, actions } = this.props

    return (
      <div className="container survey">
        <Header type="plain" />

        <div className="content">
          yoyoyoyoyo
        </div>

        <Footer/>
      </div>
    )
  }
}

SurveyApp.propTypes = {
  survey: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
  return {
    survey: state.survey,
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
