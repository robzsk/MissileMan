module.exports = function () {
  'use strict';

  var stateFactory = require('./state'),
    derivativeFactory = require('./derivative');

  var previous = stateFactory(),
    current = stateFactory();

  var integrate = function (dt, lines) {
    // TODO:
  };

  return {
    update: function () {
      previous.copyFrom(current);

    }
  };
};
