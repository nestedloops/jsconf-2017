/* eslint-disable */
// Had to embed and transpile web-midi by hand because create-react-app does not
// transpile "for val of" loops and UglifyJS would not compile it.
// web-midi is written by the awesome Matt McKegg and can be found at: https://github.com/mmckegg/web-midi
'use strict';

var Stream = require('stream');
var splitter = /^(.+)\/([0-9]+)$/;
var midiOpts = { sysex: true };

module.exports = function (name, opts) {
  opts = normalizeOpts(name, opts);

  var stream = new Stream();
  stream.readable = true;
  stream.writable = true;
  stream.paused = false;

  var queue = [];

  getInput(opts, function (err, port) {
    if (err) return stream.emit('error', err);
    stream.emit('connect');
    port.onmidimessage = function (event) {
      var d = event.data;
      if (opts.normalizeNotes) {
        d = normalizeNotes(d);
      }
      stream.emit('data', [d[0], d[1], d[2]]);
    };
    stream.on('end', function () {
      port.onmidimessage = null;
    });
    stream.inputPort = port;
  });

  stream.write = function (data) {
    queue.push(data);
  };

  stream.close = function () {
    stream.emit('close');
    stream.emit('end');
    stream.emit('finish');
    stream.removeAllListeners();
  };

  getOutput(opts, function (err, port) {
    if (err) return stream.emit('error', err);
    queue.forEach(function (data) {
      port.send(data);
    });
    stream.write = function (data) {
      port.send(data);
      stream.emit('send', data);
    };
    stream.outputPort = port;
  });

  return stream;
};

module.exports.openInput = function (name, opts) {
  opts = normalizeOpts(name, opts);

  var stream = new Stream();
  stream.readable = true;
  stream.paused = false;

  getInput(opts, function (err, port) {
    if (err) stream.emit('error', err);
    stream.emit('connect');
    port.onmidimessage = function (event) {
      var d = event.data;
      if (opts.normalizeNotes) {
        d = normalizeNotes(d);
      }
      stream.emit('data', [d[0], d[1], d[2]]);
    };
    stream.on('end', function () {
      port.onmidimessage = null;
    });
    stream.inputPort = port;
  });

  stream.close = function () {
    stream.emit('close');
    stream.emit('end');
    stream.emit('finish');
    stream.removeAllListeners();
  };

  return stream;
};

module.exports.getPortNames = function (cb) {
  getMidi(function (err, midi) {
    if (err) return cb && cb(err);
    try {
      cb && cb(null, getPortNames(midi));
    } catch (ex) {
      cb && cb(ex);
    }
  });
};

module.exports.openOutput = function (name, opts) {
  opts = normalizeOpts(name, opts);

  var stream = new Stream();
  stream.writable = true;

  var queue = [];

  stream.write = function (data) {
    queue.push(data);
  };

  stream.close = function () {
    stream.emit('close');
    stream.emit('end');
    stream.emit('finish');
    stream.removeAllListeners();
  };

  getOutput(opts, function (err, port) {
    if (err) stream.emit('error', err);
    stream.emit('connect');
    queue.forEach(function (data) {
      port.send(data);
    });
    stream.write = function (data) {
      port.send(data);
      stream.emit('send', data);
    };
    stream.outputPort = port;
  });

  return stream;
};

module.exports.watchPortNames = function (listener) {
  var midi = null;
  var refreshing = false;

  getMidi(function (err, m) {
    if (!err) {
      midi = m;
      midi.addEventListener('statechange', handleEvent);
      listener(getPortNames(midi));
    }
  });

  return function unwatch() {
    if (midi) {
      midi.removeEventListener('statechange', handleEvent);
    }
  };

  function handleEvent(e) {
    if (!refreshing) {
      refreshing = true;
      setTimeout(function () {
        listener(getPortNames(midi));
        refreshing = false;
      }, 5);
    }
  }
};

function getInput(opts, cb) {
  var index = opts.index || 0;
  getMidi(function (err, midi) {
    if (err) return cb && cb(err);
    if (!inputsOf(midi).some(function (input) {
      if (input.name === opts.name || input.id === opts.name) {
        if (index && index > 0) {
          index -= 1;
        } else {
          cb(null, input);
          return true;
        }
      }
    })) {
      cb('No input with specified name "' + opts.name + '"');
    }
  });
}

function getOutput(opts, cb) {
  var index = opts.index || 0;
  getMidi(function (err, midi) {
    if (err) return cb && cb(err);
    if (!outputsOf(midi).some(function (output) {
      if (output.name === opts.name || output.id === opts.name) {
        if (index && index > 0) {
          index -= 1;
        } else {
          cb(null, output);
          return true;
        }
      }
    })) {
      cb('No output with specified name');
    }
  });
}

function outputsOf(obj) {
  if (typeof obj.outputs === 'function') {
    return obj.outputs();
  } else {
    var result = [];
    if (obj.outputs && typeof obj.outputs.values === 'function') {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = obj.outputs.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var val = _step.value;

          result.push(val);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
    return result;
  }
}

function inputsOf(obj) {
  if (typeof obj.inputs === 'function') {
    return obj.inputs();
  } else {
    var result = [];
    if (obj.inputs && typeof obj.inputs.values === 'function') {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = obj.inputs.values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var val = _step2.value;

          result.push(val);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
    return result;
  }
}

var midi = null;
function getMidi(cb) {
  if (midi) {
    process.nextTick(function () {
      cb(null, midi);
    });
  } else if (window.navigator.requestMIDIAccess) {
    window.navigator.requestMIDIAccess(midiOpts).then(function (res) {
      midi = res;
      cb(null, midi);
    }, cb);
  } else {
    process.nextTick(function () {
      cb('Web MIDI API not available');
    });
  }
}

function getPortNames(midi) {
  var used = {};
  var names = {};
  inputsOf(midi).forEach(function (input) {
    if (used[input.name]) {
      var i = used[input.name] += 1;
      names[input.name + '/' + i] = true;
    } else {
      used[input.name] = 1;
      names[input.name] = true;
    }
  });
  used = {};
  outputsOf(midi).forEach(function (output) {
    if (used[output.name]) {
      var i = used[output.name] += 1;
      names[output.name + '/' + i] = true;
    } else {
      used[output.name] = 1;
      names[output.name] = true;
    }
  });
  return Object.keys(names);
}

function normalizeNotes(data) {
  if (data[0] >= 128 && data[0] < 128 + 16) {
    // convert note off events to 0 velocity note on events
    data = [data[0] + 16, data[1], 0];
  }
  return data;
}

function normalizeOpts(name, opts) {
  var result = {
    index: 0,
    name: name,
    normalizeNotes: opts && opts.normalizeNotes
  };

  if (typeof opts === 'number') {
    result.index = opts;
  } else if (opts.index != null) {
    result.index = opts.index;
  } else {
    var parts = splitter.exec(name);
    if (parts && parts[2]) {
      result.name = parts[1].trim();
      result.index = parseInt(parts[2], 10) - 1;
    }
  }

  return result;
}
