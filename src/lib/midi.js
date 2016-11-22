import midi from 'web-midi';

import {
  addController
} from '../data/controllers';

export default {
  store: null,

  init(storeObject) {
    this.store = storeObject;
    midi.watchPortNames(this.updateControllers.bind(this));
  },

  updateControllers(controllers) {
    const { store } = this;

    controllers.forEach((id) => {
      if (!store.getState().controllers[id]) {
        const controller = midi(id, {});
        store.dispatch(addController(id, controller));
      }
    });
  }
}
