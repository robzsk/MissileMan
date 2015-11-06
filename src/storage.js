'use strict';

var replay_default = [{'spawn': {'x': 1.5,'y': 21},'input': '{"28":{"left":false,"right":true,"jump":false,"morph":false},"82":{"left":false,"right":true,"jump":true,"morph":false},"94":{"left":false,"right":true,"jump":false,"morph":false},"380":{"left":false,"right":true,"jump":true,"morph":false},"404":{"left":false,"right":false,"jump":true,"morph":false},"415":{"left":true,"right":false,"jump":true,"morph":false},"429":{"left":false,"right":false,"jump":true,"morph":false},"443":{"left":true,"right":false,"jump":true,"morph":false},"448":{"left":false,"right":false,"jump":true,"morph":false},"459":{"left":true,"right":false,"jump":true,"morph":false},"476":{"left":false,"right":false,"jump":true,"morph":false},"484":{"left":true,"right":false,"jump":true,"morph":false},"503":{"left":false,"right":false,"jump":true,"morph":false},"511":{"left":true,"right":false,"jump":true,"morph":false},"523":{"left":false,"right":false,"jump":true,"morph":false},"538":{"left":true,"right":false,"jump":true,"morph":false},"632":{"left":false,"right":false,"jump":true,"morph":false},"673":{"left":true,"right":false,"jump":true,"morph":false},"686":{"left":false,"right":false,"jump":false,"morph":false},"695":{"left":false,"right":true,"jump":false,"morph":false},"723":{"left":false,"right":false,"jump":false,"morph":false},"749":{"left":true,"right":false,"jump":false,"morph":false},"756":{"left":false,"right":false,"jump":false,"morph":false},"765":{"left":true,"right":false,"jump":false,"morph":false},"809":{"left":true,"right":false,"jump":true,"morph":false},"816":{"left":true,"right":false,"jump":false,"morph":false},"825":{"left":true,"right":false,"jump":true,"morph":false},"828":{"left":true,"right":false,"jump":false,"morph":false},"837":{"left":true,"right":false,"jump":true,"morph":false},"840":{"left":true,"right":false,"jump":false,"morph":false},"913":{"left":true,"right":false,"jump":true,"morph":false},"930":{"left":true,"right":false,"jump":false,"morph":false},"937":{"left":true,"right":false,"jump":true,"morph":false},"944":{"left":true,"right":false,"jump":false,"morph":false},"965":{"left":false,"right":false,"jump":false,"morph":false}}'}, {'spawn': {'x': 2.5,'y': 21},'input': '{"52":{"left":false,"right":true,"jump":false,"morph":false},"59":{"left":false,"right":false,"jump":false,"morph":false},"82":{"left":false,"right":true,"jump":false,"morph":false},"90":{"left":false,"right":false,"jump":false,"morph":false},"101":{"left":false,"right":true,"jump":false,"morph":false},"110":{"left":false,"right":false,"jump":false,"morph":false},"125":{"left":false,"right":true,"jump":false,"morph":false},"134":{"left":false,"right":false,"jump":false,"morph":false},"160":{"left":false,"right":false,"jump":true,"morph":false},"196":{"left":false,"right":false,"jump":false,"morph":false},"214":{"left":false,"right":true,"jump":false,"morph":false},"222":{"left":false,"right":false,"jump":false,"morph":false},"245":{"left":false,"right":false,"jump":true,"morph":false},"261":{"left":true,"right":false,"jump":true,"morph":false},"268":{"left":false,"right":false,"jump":true,"morph":false}}'}, {'spawn': {'x': 3.5,'y': 21},'input': '{"6":{"left":false,"right":false,"jump":false,"morph":false},"112":{"left":false,"right":false,"jump":true,"morph":false},"118":{"left":true,"right":false,"jump":true,"morph":false},"126":{"left":false,"right":false,"jump":true,"morph":false},"148":{"left":false,"right":true,"jump":true,"morph":false},"175":{"left":false,"right":true,"jump":false,"morph":false},"186":{"left":false,"right":true,"jump":true,"morph":false},"196":{"left":false,"right":true,"jump":false,"morph":false},"205":{"left":false,"right":false,"jump":false,"morph":false},"977":{"left":true,"right":false,"jump":false,"morph":false}}'}];

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
        if (!reps) {
          reps = replay_default;
        }
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
