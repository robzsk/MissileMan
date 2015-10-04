module.exports = function () {
  'use strict';
  var lastLeft = false,
    lastRight = false,
    lastJump = false,
    left = false,
    right = false,
    jump = false;

  var input = {
    setLeft: function (down) {
      left = down;
    },

    setRight: function (down) {
      right = down;
    },

    setJump: function (down) {
      jump = down;
    },

    update: function (tick) {
      var move;
      if (lastLeft !== left || lastRight !== right || lastJump !== jump) {
        $(input).trigger('input.move', {left: left,right: right,jump: jump,tick: tick});
        lastLeft = left;
        lastRight = right;
        lastJump = jump;
      }
    }

  };

  return input;
};
