import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import { timezones, daysOfWeek } from '../../data'


class TimeSetting extends Component {

  // handlers
  //
  handleAttributeChange(attr, event) {
    this.props.actions.updateTimeSetting(attr, event.target.value)
  }

  handleDayClick(value, event) {
    const { days } = this.props.timeSetting
    let selectedDays

    if (days.includes(value)) {
      selectedDays = days.filter(day => day !== value)
    } else {
      selectedDays = days.concat(value)
    }

    if (selectedDays.length === 0) return
    this.props.actions.updateTimeSetting('days', selectedDays)
  }

  // renderers
  //
  renderTimezoneOption(timezone) {
    return <option value={ timezone.id }>{ timezone.text }</option>
  }

  renderStartTimeOption(time) {
    return <option value={ time }>{ time }</option>
  }

  renderEndTimeOption(time) {
    return <option value={ time }>{ time }</option>
  }

  renderDayElement(day) {
    const { days } = this.props.timeSetting
    const value = daysOfWeek[day]
    const dayClassNames = classNames({ selected: days.includes(value) })

    return(
      <li className={ dayClassNames } onClick={ this.handleDayClick.bind(this, value) }>
        { day }
      </li>
    )
  }

  render() {
    const { startTimeRange, endTimeRange } = this.props
    const { tz, startTime, endTime, days } = this.props.timeSetting

    return (
      <div>
        <h2>Select your team timezone:</h2>
        <select value={ tz } onChange={ this.handleAttributeChange.bind(this, 'tz') }>
          { timezones.map(this.renderTimezoneOption.bind(this)) }
        </select>

        <h2>Mentoring time:</h2>
        <select value={ startTime } onChange={ this.handleAttributeChange.bind(this, 'startTime') }>
          { startTimeRange.map(this.renderStartTimeOption.bind(this)) }
        </select>

        <span>—</span>

        <select value={ endTime } onChange={ this.handleAttributeChange.bind(this, 'endTime') }>
          { endTimeRange.map(this.renderEndTimeOption.bind(this)) }
        </select>

        <ul className="days-list">
          { Object.keys(daysOfWeek).map(this.renderDayElement.bind(this)) }
        </ul>
      </div>
    )
  }

}

TimeSetting.propTypes = {
  timeSetting: PropTypes.object.isRequired,
  startTimeRange: PropTypes.array.isRequired,
  endTimeRange: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
}


export default TimeSetting