module.exports = function () {
  'use strict';
  var world;
  var MAP = { tw: 64, th: 48 },
    TILE = 1;

  var players = [],
    targets = [],
    cells = [],
    playerToWatch;

  var assets = require('./assets'),
    sceneFactory = require('./scene');

  var scene = sceneFactory($('#canvas'));

  var tcell = function (tx, ty) { return cells[tx + (ty * MAP.tw)];};
  var ty = function (y) { return MAP.th - y;}; // little hack to show y position in 3d space instead of canvas space

  var overlap = function (x1, y1, w1, h1, x2, y2, w2, h2) {
    return !(((x1 + w1) < x2) ||
    ((x2 + w2) < x1) ||
    ((y1 + h1) < y2) ||
    ((y2 + h2) < y1));
  };

  var collideTargets = function (entity) {
    _.find(targets, function (t) {
      if (overlap(entity.x, entity.y, 1, 1, t.x, t.y, 1, 1)) {
        scene.remove(entity.avatar);
        scene.remove(t.avatar);
        targets = _.without(targets, _.findWhere(targets, t));
        players = _.without(players, _.findWhere(players, entity)); // TODO: check the findwhere is needed
        $(world).trigger('world.player.killed', entity);

        return true;
      }
      return false;
    });
  };

  var collideCells = function (entity) {
    var tx = Math.floor(entity.x),
      ty = Math.floor(entity.y),
      nx = entity.x % TILE,
      ny = entity.y % TILE,
      cell = tcell(tx, ty),
      cellright = tcell(tx + 1, ty),
      celldown = tcell(tx, ty + 1),
      celldiag = tcell(tx + 1, ty + 1);

    if (entity.dy > 0) {
      if ((celldown && !cell) ||
        (celldiag && !cellright && nx)) {
        entity.y = ty;
        entity.dy = 0;
        entity.falling = false;
        entity.jumping = false;
        ny = 0;
      }
    }
    else if (entity.dy < 0) {
      if ((cell && !celldown) ||
        (cellright && !celldiag && nx)) {
        entity.y = ty + 1;
        entity.dy = 0;
        cell = celldown;
        cellright = celldiag;
        ny = 0;
      }
    }

    if (entity.dx > 0) {
      if ((cellright && !cell) ||
        (celldiag && !celldown && ny)) {
        entity.x = tx;
        entity.dx = 0;
      }
    }
    else if (entity.dx < 0) {
      if ((cell && !cellright) ||
        (celldown && !celldiag && ny)) {
        entity.x = tx + 1;
        entity.dx = 0;
      }
    }

    entity.falling = ! (celldown || (nx && celldiag));
  };

  world = {
    update: function (ticks, step) {
      _.each(players, function (p) {
        p.update(ticks, step);
        collideCells(p);
        collideTargets(p);
      });
    },

    render: function (dt) {
      _.each(players, function (p) {
        p.avatar.position.set(p.x + (p.dx * dt), ty(p.y + (p.dy * dt)), 0);
      });

      if (playerToWatch) {
        scene.follow(playerToWatch.position);
      }
      scene.render();
    },

    clear: function () {
      players = [];
      targets = [];
      cells = [];
      scene.clear();
    },

    addTarget: function (target) {
      var cube = assets.cubeTarget();
      targets.push(target);
      target.avatar = cube;
      cube.position.set(target.x, ty(target.y), 0);
      scene.add(cube);
    },

    addPlayer: function (player, watch) {
      players.push(player);
      player.avatar = assets.cubePlayer();
      scene.add(player.avatar);
      if (watch) {
        playerToWatch = player.avatar;
      }
    },

    addBlocks: function (blocks) {
      cells = blocks;
      var x, y, cell, cube;
      for (y = 0; y < MAP.th; y++) {
        for (x = 0; x < MAP.tw; x++) {
          cell = tcell(x, y);
          if (cell === 1) {
            cube = assets.cubeSolid();
          } else {
            cube = assets.cubeEmpty();
          }
          cube.position.set(x, ty(y), 0);
          scene.add(cube);
        }
      }
    },

    isComplete: function () {
      return targets.length <= 0;
    }

  };
  return world;
}();
