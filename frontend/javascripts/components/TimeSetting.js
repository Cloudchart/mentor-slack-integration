import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import { timezones, dayTimes, daysOfWeek } from '../../data'


class TimeSetting extends Component {

  constructor(props) {
    super(props)
    this.state = {
      tz: this.props.timeSetting.tz,
      startTime: this.props.timeSetting.startTime,
      endTime: this.props.timeSetting.endTime,
      days: this.props.timeSetting.days,
    }
  }

  // handlers
  //
  handleAttributeChange(attr, event) {
    this.setState({ [attr]: event.target.value })
  }

  handleDayClick(day, event) {
    console.log(day);
  }

  // renderers
  //
  renderTimezoneOptions(timezone) {
    return(
      <option value={ timezone.id }>
        { timezone.text }
      </option>
    )
  }

  renderStartTimeOptions(time) {
    return(
      <option value={ time }>
        { time }
      </option>
    )
  }

  renderEndTimeOptions(time) {
    return(
      <option value={ time }>
        { time }
      </option>
    )
  }

  renderDaysList(day) {
    let value = daysOfWeek[day]
    let dayClassNames = classNames({ selected: this.state.days.includes(value) })

    return(
      <li className={ dayClassNames } onClick={ this.handleDayClick.bind(this, value) }>
        { day }
      </li>
    )
  }

  render() {
    return (
      <div>
        <h2>Select your team timezone:</h2>
        <select value={ this.state.tz } onChange={ this.handleAttributeChange.bind(this, 'tz') }>
          { timezones.map(this.renderTimezoneOptions.bind(this)) }
        </select>

        <h2>Mentoring time:</h2>
        <select value={ this.state.startTime } onChange={ this.handleAttributeChange.bind(this, 'startTime') }>
          { dayTimes.map(this.renderStartTimeOptions.bind(this)) }
        </select>

        <span>—</span>

        <select value={ this.state.endTime } onChange={ this.handleAttributeChange.bind(this, 'endTime') }>
          { dayTimes.map(this.renderEndTimeOptions.bind(this)) }
        </select>

        <ul className="days-list">
          { Object.keys(daysOfWeek).map(this.renderDaysList.bind(this)) }
        </ul>
      </div>
    )
  }

}

TimeSetting.propTypes = {
  timeSetting: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
}


export default TimeSetting
