import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Modal from 'boron/FadeModal'

import { surveysActions } from '../actions'

import Header from '../components/Header'
import SurveysList from '../components/admin/SurveysList'
import SurveysForm from '../components/admin/SurveysForm'
import Footer from '../components/Footer'


class SurveysApp extends Component {

  // handlers
  //
  handleNewClick(event) {
    event.preventDefault()
    this.refs.modal.show()
  }

  handleSurveySubmit() {
    this.refs.modal.hide()
  }

  // renderers
  //
  render() {
    const { team, surveys, actions } = this.props

    return (
      <div className="container surveys">
        <Header team={ team } />

        <div className="content">
          <SurveysList surveys={ surveys } actions={ actions } />
          <a href="" onClick={ this.handleNewClick.bind(this) }>New</a>
          <Modal ref="modal">
            <div className="modal-content surveys-new">
              <SurveysForm
                surveys={ surveys }
                actions={ actions }
                onSubmit={ this.handleSurveySubmit.bind(this) }
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
  actions: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
  return {
    team: state.team,
    surveys: state.surveys,
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
