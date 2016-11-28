import midi from 'web-midi';

import {
  addController,
  removeController
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
    this.previousControllers = {};

    midi.watchPortNames(this.setControllers);

    storeObject.subscribe(() => {
      const { buttons, scheduler, controllers } = storeObject.getState();
      if (buttons !== this.previousButtons
       || scheduler !== this.previouseScheduler
       || controllers !== this.previousControllers) {
        this.previousButtons = buttons;
        this.previouseScheduler = scheduler;
        this.previousControllers = controllers;
        this.updateControllers();
      }
    });
  }

  setControllers = (controllers) => {
    const { store } = this;

    // remove controllers that were there previously
    Object.keys(this.previousControllers).forEach((id) => {
      this.previousControllers[id].close();
      store.dispatch(removeController(id));
    });

    const currentControllers = store.getState().controllers;
    controllers.forEach((id) => {
      if (!currentControllers[id]) {
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

    const controllerKeys = Object.keys(controllers);
    const mappings = {};

    Object.keys(arrangements).forEach((arrangementId, index) => {
      const controller = controllerKeys.find((key) => !mappings[key] && key.includes('Launchpad'));
      if (controller) {
        mappings[controller] = arrangements[arrangementId];
      }
    });

    Object.keys(controllers).forEach((controllerId, index) => {
      const arrangement = mappings[controllerId];
      const controller = controllers[controllerId];

      for (var y = 0; y < 8; y++) {
        for (var x = 0; x < 8; x++) {
          const key = y * 16 + x;
          if (arrangement) {
            const arrangementButton = arrangement.buttons[y][x];

            if (arrangementButton) {
              if (scheduler.scheduled[arrangementButton]) {
                controller.write([144, key, COLOR_CODES.YELLOW]);
              } else if (scheduler.playing[arrangementButton]) {
                controller.write([144, key, COLOR_CODES.AMBER]);
              } else {
                controller.write([144, key, COLOR_CODES.GREEN]);
              }
            } else {
              controller.write([144, key, COLOR_CODES.OFF]);
            }
          } else {
            controllers[controllerId].write([144, key, COLOR_CODES.OFF]);
          }
        }
      }
    });

  }

}

const instance = new Midi();
export default instance;
