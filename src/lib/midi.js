import midi from '../vendor/web-midi';

import {
  addController,
  mapControllerToPad,
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
  init(storeObject, clipHandler = () => {}) {
    this.store = storeObject;
    this.clipHandler = clipHandler;
    this.previousClips = null;
    this.previouseScheduler = null;
    this.previousControllers = {};

    midi.watchPortNames(this.setControllers);

    storeObject.subscribe(() => {
      const { clips, scheduler, controllers } = storeObject.getState();
      if (clips !== this.previousClips
       || scheduler !== this.previouseScheduler
       || controllers !== this.previousControllers) {
        this.previousClips = clips;
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
      this.previousControllers[id].controller.close();
      store.dispatch(removeController(id));
    });

    const currentControllers = store.getState().controllers;
    controllers.forEach((id, index) => {
      if (!currentControllers[id]) {
        const controller = midi(id, {});
        controller.on('data', ([type, key, data]) => {
          const state = this.store.getState();
          const down = data > 0;
          const y = Math.floor(key / 16);
          const x = key % 16;
          if (down) {
            if (x < 8 && y < 8) {
              const padId = state.controllers[id].pad;
              const pad = state.pads[padId];

              // this controller is not controlling a clip
              if (!padId || !pad) { return; }

              const clipId = pad.clips[y][x];
              this.clipHandler(clipId, pad, x, y);
            } else if (type === 144 && (key < 105 || key > 111)) {
              this.mapControllerToPadIndex(id, y);
            }
          }
        });
        // map controller to matching pad at index if possible
        const padKeys = Object.keys(store.getState().pads);
        const initialPad = index < padKeys.length ? padKeys[index] : padKeys[0];
        store.dispatch(addController(id, controller, initialPad));
      }
    });
  }

  mapControllerToPadIndex(controller, padIndex) {
    const { pads } = this.store.getState();
    const padId = Object.keys(pads)[padIndex];
    this.store.dispatch(mapControllerToPad(controller, padId));
  }

  updateControllers = () => {
    const { pads, controllers, scheduler } = this.store.getState();

    Object.keys(controllers).forEach((controllerId, index) => {
      const controllerConfig = controllers[controllerId];
      const { controller } = controllerConfig;
      const pad = pads[controllerConfig.pad];

      // write the clip status
      for (var y = 0; y < 8; y++) {
        for (var x = 0; x < 8; x++) {
          const key = y * 16 + x;
          if (pad) {
            const padClip = pad.clips[y][x];

            if (padClip) {
              if (scheduler.scheduled[padClip]) {
                controller.write([144, key, COLOR_CODES.YELLOW]);
              } else if (scheduler.playing[padClip]) {
                controller.write([144, key, COLOR_CODES.AMBER]);
              } else {
                controller.write([144, key, COLOR_CODES.GREEN]);
              }
            } else {
              controller.write([144, key, COLOR_CODES.OFF]);
            }
          } else {
            controller.write([144, key, COLOR_CODES.OFF]);
          }
        }
      }

      // write the pad status
      const padKeys = Object.keys(pads);
      const activePadId = pad && padKeys.indexOf(controllerConfig.pad);
      for (var i = 0; i < 8; i++) {
        controller.write([
          144,
          8 + i * 16,
          activePadId === i ? COLOR_CODES.GREEN : i < padKeys.length ? COLOR_CODES.YELLOW : COLOR_CODES.OFF
        ]);
      }
    });
  }
}

const instance = new Midi();
export default instance;
