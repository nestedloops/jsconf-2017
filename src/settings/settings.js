import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux'
import { changeSetting } from '../data/settings';

import '../styles/forms.css';
import './settings.css';

class Settings extends React.Component {
  render() {
    const { settings } = this.props;

    if (_.isEmpty(settings)) { return null; }

    return (
      <div className="settings">
        <label className="editorForm__label">
          <span className="editorForm__labelText">BPM:</span>
          <span className="editorForm__row">
            <input type="range" min={20} max={200} step={1} value={settings.bpm} onChange={this.onBpmChanged} />
            <span className="editorForm__value">{ settings.bpm }</span>
          </span>
        </label>
      </div>
    );
  }

  onBpmChanged = (event) => this.props.changeSetting('bpm', parseInt(event.target.value, 10));
}


const mapStateToProps = (state) => ({ settings: state.settings });
const mapDispatchToProps = (dispatch) => ({
  changeSetting(settingId, value){ dispatch(changeSetting(settingId, value)) }
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
