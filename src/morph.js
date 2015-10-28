'use strict';

var util = require('util'),
  EventEmitter = require('events').EventEmitter,
  easing = require('bezier-easing');

var Morph = function () {
  EventEmitter.call(this);

  const ttl = 7;

  var self = this,
    easeDown = easing(0, 0, 1, 1),
    easeUp = easing(0.25, 0.25, 0.5, 2.5),
    n = 0,
    scale = 1,
    down = false,
    up = false,
    isMan = true;

  var doMorph = function () {
    if (isMan) {
      isMan = false;
      self.emit('morph.changeToMissile');
    } else {
      isMan = true;
      self.emit('morph.changeToMan');
    }
  };

  var canMorph = function () {
    return !down && !up;
  };

  this.reset = function () {
    scale = 1;
    n = 0;
    isMan = true;
    up = down = false;
  };

  this.isMan = function () {
    return isMan;
  };

  this.getScale = function () {
    // if scale is zero three.js throws
    // Matrix3.getInverse(): can't invert matrix, determinant is 0
    return scale || 0.00001;
  };

  this.go = function () {
    if (canMorph()) {
      down = true;
    }
  };

  this.update = function () {
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
  };

};

util.inherits(Morph, EventEmitter);

module.exports = Morph;
