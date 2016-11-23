import midi from 'web-midi';

import {
  addController
} from '../data/controllers';

const COLOR_CODES = {
  OFF: 12,
  RED: 15,
  AMBER: 63,
  YELLOW: 62,
  GREEN: 60
};

class Midi {
  init(storeObject) {
    this.store = storeObject;
    this.previousButtons = null;
    midi.watchPortNames(this.setControllers);
    storeObject.subscribe(() => {
      const { buttons } = storeObject.getState();
      if (buttons !== this.previousButtons) {
        this.scheduleUpdate();
        this.previousButtons = buttons;
      }
    });
    this.scheduleUpdate();
  }

  setControllers = (controllers) => {
    const { store } = this;

    // TODO: add logic to remove controllers
    controllers.forEach((id) => {
      if (!store.getState().controllers[id]) {
        const controller = midi(id, {});
        store.dispatch(addController(id, controller));
      }
    });
  }

  updateControllers = () => {
    const { arrangements, controllers } = this.store.getState();
    const theArrangement = arrangements.arrangement1;
    const firstController = controllers[Object.keys(controllers).pop()];
    if (!firstController) { return this.scheduleUpdate();}
    for (var y = 0; y < 8; y++) {
      for (var x = 0; x < 8; x++) {
        const arrangementButton = theArrangement.buttons[y][x];
        const key = y * 16 + x;
        const color = arrangementButton ? COLOR_CODES.GREEN : COLOR_CODES.OFF;
        firstController.write([144, key, color]);
      }
    }
  }

  scheduleUpdate() {
    requestIdleCallback(this.updateControllers);
  }
}

const instance = new Midi();
export default instance;
