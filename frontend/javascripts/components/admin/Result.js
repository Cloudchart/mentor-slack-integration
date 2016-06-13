import React, { Component, PropTypes } from 'react'


class Result extends Component {

  constructor(props) {
    super(props)
    this.state = {
      percentage: props.result.percentage,
      text: props.result.text,
    }
  }

  // lifecycle
  //
  // conponentDidMount() {
  // }

  // componentWillReceiveProps(nextProps) {
  // }

  // helpers
  //
  getAttrs() {
    return {
      percentage: this.state.percentage,
      text: this.state.text,
    }
  }

  // handlers
  //
  handleInputChange(attr, event) {
    this.setState({ [attr]: event.target.value })
  }

  handleUpdate(event) {
    event.preventDefault()
    this.props.actions.updateResult(this.props.result.id, this.refs.form)
  }

  handleDestroy(event) {
    event.preventDefault()
    if (window.confirm('Are you sure?')) this.props.actions.destroyResult(this.props.result.id)
  }

  // renderers
  //
  renderImage() {
    if (!this.props.result.imagePath) return null
    return(
      <img
        src={ process.env.ROOT_URL + this.props.result.imagePath }
        width="100"
      />
    )
  }

  render() {
    const { result } = this.props

    return (
      <li>
        <form ref="form" encType="multipart/form-data" onSubmit={ this.handleUpdate.bind(this) }>
          <div>
            <input
              type="text"
              name="percentage"
              placeholder="Enter result percentage"
              value={ this.state.percentage }
              onChange={ this.handleInputChange.bind(this, 'percentage') }
              onBlur={ this.handleUpdate.bind(this) }
            />
          </div>
          <div>
            <textarea
            name="text"
              placeholder="Enter result text"
              value={ this.state.text }
              onChange={ this.handleInputChange.bind(this, 'text') }
              onBlur={ this.handleUpdate.bind(this) }
            />
          </div>
          <div>
            <input
              type="file"
              name="image"
              onChange={ this.handleUpdate.bind(this) }
            />
            { this.renderImage() }
          </div>
        </form>

        <a href="" onClick={ this.handleDestroy.bind(this) }>Destroy</a>
      </li>
    )
  }

}

Result.propTypes = {
  result: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
}


export default Result
