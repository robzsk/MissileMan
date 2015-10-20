'use strict';

const replayInput = function (file) {
  var moves = JSON.parse(file);
  return {
    update: function (tick) {
      var m = moves['_' + tick];
      if (m) {
        $(this).trigger('input.move', _.clone(m));
      }
    }
  };
};

const keyboardInput = function (keys) {
  var current = _.mapObject(keys, function () { return false; }),
    prev = _.clone(current), moves = {};

  const onkey = function (ev, kc, down) {
    _.findKey(keys, function (v, k) {
      if (v === kc) {
        current[k] = down;
        ev.preventDefault();
        return true;
      }
    });
  };

  $(document).keydown(function (ev) { return onkey(ev, ev.keyCode, true); });
  $(document).keyup(function (ev) { return onkey(ev, ev.keyCode, false); });

  return {
    reset: function () {
      moves = {};
    },

    serialize: function () {
      return JSON.stringify(moves);
    },

    update: function (tick) {
      if (!_.isMatch(current, prev)) {
        moves['_' + tick] = _.clone(current);
        $(this).trigger('input.move', _.clone(current));
        _.extend(prev, current); // copy
      }
    }
  };
};

module.exports = function (config) {
  if (config.replay) {
    return replayInput(config.replay);
  } else {
    return keyboardInput(config.keys);
  }
};
