import React, {Component} from 'react';
import {connect} from 'react-redux';

import {GUI} from 'dat.gui/build/dat.gui.js';
import {setRenderparam} from './data/video-renderer';

import './video-controls-gui.css';

class VideoControlsGui extends Component {
  componentWillUpdate(nextProps) {
    if (!this.gui) { return; }

    const {renderParams} = nextProps;
    Object.keys(renderParams).forEach(name => {
      if (renderParams[name] !== this.guiState[name]) {
        this.guiState[name] = renderParams[name];
        this.guiControllers[name].updateDisplay();
      }
    });
  }

  componentDidMount() {
    this.gui = new GUI({autoPlace: false});
    this.guiState = Object.assign({}, this.props.renderParams);

    this.guiControllers = {
      backgroundColor: this.gui.addColor(this.guiState, 'backgroundColor'),
      foregroundColor: this.gui.addColor(this.guiState, 'foregroundColor'),
      pointSize: this.gui.add(this.guiState, 'pointSize', 0, .5),
      luminanceMin: this.gui.add(this.guiState, 'luminanceMin', 0, 1),
      luminanceMax: this.gui.add(this.guiState, 'luminanceMax', 0, 1),
      r0: this.gui.add(this.guiState, 'r0', 0, 1),
      resolution: this.gui.add(this.guiState, 'resolution', [
        '80x45', '96x54', '160x90', '240x135', '320x180', '640x360'
      ])
    };

    Object.keys(this.guiControllers).forEach(name => {
      this.guiControllers[name].onChange(value => {
        this.props.onValueChange(name, value);
      });
    });

    this.container.appendChild(this.gui.domElement);
  }

  componentWillUnmount() {
    this.gui.domElement.parentNode.removeChild(this.gui.domElement);
    this.gui.destroy();
    this.gui = null;
    this.guiControllers = {};
    this.guiState = {};
  }

  render() {
    return (
      <div className="gui-container" ref={el => this.container = el} />
    );
  }
}

const mapStateToProps = (state) => ({
  renderParams: state.videoRenderer.renderParams
});

const mapDispatchToProps = (dispatch) => ({
  onValueChange: (name, value) => dispatch(setRenderparam(name, value))
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoControlsGui)