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
      // TODO: refactor this
      var sx = Math.floor(entity.x),
        sy = Math.floor(entity.y);
      var mask = 0;
      mask += tcell(sx - 1, sy - 1) ? 4 : 0;
      mask += tcell(sx, sy - 1) ? 2 : 0;
      mask += tcell(sx + 1, sy - 1) ? 1 : 0;
      var lines = line.makeLines(mask, 'bottom');
      var linesToSend = [];
      _.each(lines, function (l) {
        linesToSend.push(line.createLine(
          {a: [sx + l.a[0], sy + l.a[1]],
          b: [sx + l.b[0], sy + l.b[1]]}
        ));
      });
      return linesToSend;
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
