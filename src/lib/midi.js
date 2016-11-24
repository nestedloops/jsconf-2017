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
  init(storeObject, buttonHandler = () => {}) {
    this.store = storeObject;
    this.buttonHandler = buttonHandler;
    this.previousButtons = null;
    this.previouseScheduler = null;

    midi.watchPortNames(this.setControllers);

    storeObject.subscribe(() => {
      const { buttons, scheduler } = storeObject.getState();
      if (buttons !== this.previousButtons || scheduler !== this.previouseScheduler) {
        this.scheduleUpdate();
        this.previousButtons = buttons;
        this.previouseScheduler = scheduler;
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
        controller.on('data', ([_, key, data]) => {
          const down = data > 0;
          const y = Math.floor(key / 16);
          const x = key % 16;
          if (down && x < 8 && y < 8) {
            const { arrangements } = this.store.getState();
            const buttonId = arrangements.arrangement1.buttons[y][x];
            this.buttonHandler(buttonId);
          }
        });
        store.dispatch(addController(id, controller));
      }
    });
  }

  updateControllers = () => {
    const { arrangements, controllers, scheduler } = this.store.getState();
    const theArrangement = arrangements.arrangement1;
    const firstController = controllers[Object.keys(controllers).pop()];
    if (!firstController) { return this.scheduleUpdate();}
    for (var y = 0; y < 8; y++) {
      for (var x = 0; x < 8; x++) {
        const arrangementButton = theArrangement.buttons[y][x];
        const key = y * 16 + x;

        if (arrangementButton) {
          if (scheduler.scheduled[arrangementButton]) {
            firstController.write([144, key, COLOR_CODES.YELLOW]);
          } else if (scheduler.playing[arrangementButton]) {
            firstController.write([144, key, COLOR_CODES.AMBER]);
          } else {
            firstController.write([144, key, COLOR_CODES.GREEN]);
          }
        } else {
          firstController.write([144, key, COLOR_CODES.OFF]);
        }
      }
    }
  }

  scheduleUpdate() {
    requestIdleCallback(this.updateControllers);
  }
}

const instance = new Midi();
export default instance;
