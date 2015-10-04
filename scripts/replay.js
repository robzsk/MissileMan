module.exports = function (input) {
  'use strict';

  var moves = {};

  if (input) {
    $(input).on('input.move', function (e, m) {
      moves['_' + m.tick] = m;
    });
  }

  var replay = {
    reset: function () {
      moves = {};
    },

    deserialize: function (file) {
      moves = file;
    },
    serialize: function () {
      var file = JSON.stringify(moves);
      return file;
    },

    update: function (tick) {
      var m = moves['_' + tick];
      if (m) {
        $(replay).trigger('input.move', m);
      }
    }
  };
  return replay;
};
