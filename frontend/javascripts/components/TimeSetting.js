import React, { Component, PropTypes } from 'react'
import { dayTimes, timezones } from '../../data'


class TimeSetting extends Component {

  // renderers
  //
  renderStartTimeOptions(time) {
    return(
      <option value={ time } selected={ time === this.props.timeSetting.startTime }>
        { time }
      </option>
    )
  }

  renderEndTimeOptions(time) {
    return(
      <option value={ time } selected={ time === this.props.timeSetting.endTime }>
        { time }
      </option>
    )
  }

  renderTimezoneOptions(timezone) {
    return(
      <option value={ timezone.id } selected={ timezone.id === this.props.timeSetting.tz }>
        { timezone.text }
      </option>
    )
  }

  render() {
    return (
      <div>
        <h2>Select your team timezone:</h2>
        <select>
          { timezones.map(this.renderTimezoneOptions.bind(this)) }
        </select>

        <h2>Mentoring time:</h2>
        <select>
          { dayTimes.map(this.renderStartTimeOptions.bind(this)) }
        </select>

        <span>—</span>

        <select>
          { dayTimes.map(this.renderEndTimeOptions.bind(this)) }
        </select>
      </div>
    )
  }

}

TimeSetting.propTypes = {
  timeSetting: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
}


export default TimeSetting
