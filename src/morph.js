module.exports = function () {
  const easeDown = require('bezier-easing')(0, 0, 1, 1),
    easeUp = require('bezier-easing')(0.25, 0.25, 0.5, 2.5);

  const ttl = 7;

  var n = 0,
    scale = 1,
    down = false,
    up = false,
    isMan = true;

  const doMorph = function () {
      if (isMan) {
        isMan = false;
        $(morph).trigger('morph.changeToMissile');
      } else {
        isMan = true;
        $(morph).trigger('morph.changeToMan');
      }
    },

    canMorph = function () {
      return !down && !up;
    };

  const morph = {
    reset: function () {
      scale = 1;
      n = 0;
      isMan = true;
      up = down = false;
    },
    // override these
    changeToMan: function () {},
    changeToMissile: function () {},

    isMan: function () {
      return isMan;
    },

    getScale: function () {
      // if scale is zero three.js throws
      // Matrix3.getInverse(): can't invert matrix, determinant is 0
      return scale || 0.00001;
    },

    go: function () {
      if (canMorph()) {
        down = true;
      }
    },

    update: function () {
      if (down) {
        scale = easeDown.get(n / ttl);
        n -= 1;
        if (n < 0) {
          down = false;
          up = true;
          n = 0;
          doMorph();
        }
      }
      if (up) {
        scale = easeUp.get(n / ttl);
        n += 1;
        if (n > ttl) {
          up = false;
          n = ttl;
        }
      }
    }
  };

  return morph;
};
