var line = require('./line');

module.exports = function () {
  'use strict';

  // TODO: need to store and read the map differently
  // use the map editor for creating etc
  // for now dimensions are hard coded
  var cells = [],
    MAP = { tw: 64, th: 48 },
    tcell = function (tx, ty) { return cells[tx + (ty * MAP.tw)]; };

  return {
    clear: function () {
      cells = [];
    },
    getLines: function (entity) {
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
    },

    // TODO: refactor this out. need to read the cells differently from the level file
    // or just straight up put the in the level data?
    getCell: function (x, y) {
      return tcell(x, y);
    },
    addBlocks: function (blocks) {
      cells = blocks;
    }
  };

};
