import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux'
import { changeSetting } from '../data/settings';
import { saveProjectAsZip } from '../lib/files';
import { remote } from 'electron';
const { dialog } = require('electron').remote;
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

        <button onClick={this.exportProject} className="settings__button">
          Export Project
        </button>

        <button onClick={this.closeProject} className="settings__button">
          Close Project
        </button>
      </div>
    );
  }

  onBpmChanged = (event) => this.props.changeSetting('bpm', parseInt(event.target.value, 10));

  exportProject = (event) => {
    event.preventDefault();
    const { params: { project_id } } = this.props;
    saveProjectAsZip(project_id);
  };

  closeProject = () => {
    const result = dialog.showMessageBox({
      message: 'Are you shure you want to close the project?',
      title: 'Closing project',
      buttons: ['No', 'Yes']
    });

    if (result === 1) {
      location.href = '/'
    }
  }
}


const mapStateToProps = (state) => ({ settings: state.settings });
const mapDispatchToProps = (dispatch) => ({
  changeSetting(settingId, value){ dispatch(changeSetting(settingId, value)) }
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
