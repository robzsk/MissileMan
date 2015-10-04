'use strict';

var replayInput = function (file) {
  var moves = JSON.parse(file);
  var input = {
    update: function (tick) {
      var m = moves['_' + tick];
      if (m) {
        $(input).trigger('input.move', m);
      }
    }
  };
  return input;
};

var keyboardInput = function (keys) {
  var moves = {},
    lastLeft = false, lastRight = false, lastJump = false, left = false, right = false, jump = false;

  var onkey = function (ev, kc, down) {
    switch (kc) {
      case keys.left:
        left = down;
        ev.preventDefault();
        return false;
      case keys.right:
        right = down;
        ev.preventDefault();
        return false;
      case keys.jump:
        jump = down;
        ev.preventDefault();
        return false;
    }
  };

  document.addEventListener('keydown', function (ev) { return onkey(ev, ev.keyCode, true);  }, false);
  document.addEventListener('keyup', function (ev) { return onkey(ev, ev.keyCode, false); }, false);

  var input = {
    reset: function () {
      moves = {};
    },

    serialize: function () {
      return JSON.stringify(moves);
    },

    update: function (tick) {
      var move;
      if (lastLeft !== left || lastRight !== right || lastJump !== jump) {
        move = { left: left,right: right,jump: jump,tick: tick };
        moves['_' + tick] = move;
        $(input).trigger('input.move', move);
        lastLeft = left;
        lastRight = right;
        lastJump = jump;
      }
    }
  };
  return input;
};

module.exports = function (config) {
  if (config.replay) {
    return replayInput(config.replay);
  } else {
    return keyboardInput(config.keys);
  }
};
