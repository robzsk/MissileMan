'use strict';

var line = require('./line');

var Map = function () {
  var cells = [],
    tcell = function (tx, ty) { return cells[ty][tx]; };

  this.clear = function () {
    cells = [];
  };

  this.getLines = function (entity) {
    var x = Math.floor(entity.position().x),
      y = Math.floor(entity.position().y);
    var n = 0;
    n += tcell(x - 1, y + 1) ? 1 : 0;
    n += tcell(x  , y + 1) ? 2 : 0;
    n += tcell(x + 1, y + 1) ? 4 : 0;
    n += tcell(x - 1, y) ? 8 : 0;
    n += tcell(x + 1, y) ? 16 : 0;
    n += tcell(x - 1, y - 1) ? 32 : 0;
    n += tcell(x  , y - 1) ? 64 : 0;
    n += tcell(x + 1, y - 1) ? 128 : 0;

    return line.getLines(n, x, y);
  };

  this.addBlocks = function (blocks) {
    cells = blocks;
  };

};

module.exports = Map;
