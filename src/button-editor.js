import React, { Component } from 'react';
import { connect } from 'react-redux';
import { changeButtonField } from './data/buttons';

const BUTTON_TYPES = ['audiosample', 'video'];

class ButtonEditor extends Component {
  shouldComponentUpdate(newProps){
    return newProps.button !== this.props.button;
  }

  render() {
    const currentType = this.props.button.type;
    return (
      <div className="buttonEditor">
        <select
          className="buttonEditor__buttonSelect"
          value={currentType}
          onChange={this.onChange}
        >
          { BUTTON_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        { this.renderForm() }
      </div>
    );
  }

  renderForm() {
    switch (this.props.button.type) {
      case 'audiosample':
        return this.renderAudioForm();
      default:
        return null;
    }
  }

  renderAudioForm() {
    const { button, files } = this.props;

    return (
      <form>
        <label>
          <input
            type="checkbox"
            checked={button.schedulable}
            onChange={this.changeSchedulable}
          />
          schedulable
        </label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          onChange={this.changeGain}
          value={button.gain}
        />
        <select
          value={button.file}
          onChange={this.changeFile}
        >
          { Object.keys(files).map((fileId) =>
            <option
              key={fileId}
              value={fileId}
            >{files[fileId].name}
            </option>
          )}
        </select>
      </form>
    );
  }

  onChange(event) {

  }

  changeSchedulable = () => {
    this.props.changeButtonField('schedulable', !this.props.button.schedulable);
  }

  changeGain = (event) => {
    this.props.changeButtonField('gain', parseFloat(event.target.value));
  }

  changeFile = (event) => {
    this.props.changeButtonField('file', event.target.value);
  }

}

const mapStateToProps = (state) => ({
  files: state.files
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  changeButtonField(field, value) {
    return dispatch(changeButtonField(ownProps.button.id, field, value));
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(ButtonEditor);
