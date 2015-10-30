'use strict';

var _ = require('underscore'),
  util = require('util'),
  EventEmitter = require('events').EventEmitter;

var ReplayInput = function (file) {
  var moves = JSON.parse(file), self = this;

  EventEmitter.call(this);

  this.update = function (tick) {
    var m = moves[tick.toString()];
    if (m) {
      self.emit('input.move', _.clone(m));
    }
  };
};
util.inherits(ReplayInput, EventEmitter);

var KeyboardInput = function (keys) {
  var current = _.mapObject(keys, function () { return false; }),
    prev = _.clone(current), moves = {}, self = this;

  EventEmitter.call(this);

  const onkey = function (ev, kc, down) {
    _.findKey(keys, function (v, k) {
      if (v === kc) {
        current[k] = down;
        ev.preventDefault();
        return true;
      }
    });
  };

  document.body.addEventListener('keydown', function (ev) { return onkey(ev, ev.keyCode, true); });
  document.body.addEventListener('keyup', function (ev) { return onkey(ev, ev.keyCode, false); });

  this.reset = function () {
    moves = {};
  };

  this.serialize = function () {
    return JSON.stringify(moves);
  };

  this.update = function (tick) {
    if (!_.isMatch(current, prev)) {
      moves[tick.toString()] = _.clone(current);
      self.emit('input.move', _.clone(current));
      _.extend(prev, current); // copy
    }
  };
};
util.inherits(KeyboardInput, EventEmitter);

module.exports = function (config) {
  if (config.replay) {
    return new ReplayInput(config.replay);
  } else {
    return new KeyboardInput(config.keys);
  }
};
