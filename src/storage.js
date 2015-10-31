'use strict';

var _ = require('underscore'),
  Input = require('./engine/input');

module.exports = function () {
  'use strict';
  var s = function (k, v) {
    if (k && v) {
      localStorage.setItem(k, JSON.stringify(v));
    } else if (k && !v) {
      return JSON.parse(localStorage.getItem(k));
    } else {
      console.error('Key was undefined while using local storage.');
    }
  };
  return {
    replays: function (v) {
      var reps, replays;
      if (v) {
        reps = [];
        _.each(v, function (r) {
          reps.push({
            spawn: r.spawn,
            input: r.input.serialize()
          });
        });
        return s('replays', reps);
      } else {
        reps = s('replays', reps);
        replays = [];
        _.each(reps, function (r) {
          replays.push({
            spawn: r.spawn,
            input: new Input({replay: r.input})
          });
        });
        return replays;
      }
    },

    test: function (v) {
      return s('test', v);
    },

    error: function () {
      return s();
    }

  };
}();
