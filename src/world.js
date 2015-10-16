module.exports = function () {
  'use strict';

  var assets = require('./assets'),
    sceneFactory = require('./scene'),
    mapFactory = require('./physics/map');

  var players = [],
    targets = [],
    map = mapFactory(),
    playerToWatch,
    world,
    MAP = { tw: 64, th: 48 }, // TODO: this is also hard coded in map.js. we don't want these shenanigans
    scene = sceneFactory($('#canvas'));

  return {
    update: function (ticks, step) {
      _.each(players, function (p) {
        p.update(ticks, step, map.getLines(p));
      });
    },

    render: function (dt) {
      _.each(players, function (p) {
        p.avatar.setRotationFromQuaternion(p.orientation());
        p.avatar.position.copy(p.position());
      });

      if (playerToWatch) {
        scene.follow(playerToWatch.position);
      }
      scene.render();
    },

    clear: function () {
      players = [];
      targets = [];
      map.clear();
      scene.clear();
    },

    addTarget: function (target) {
      var cube = assets.cubeTarget();
      targets.push(target);
      target.avatar = cube;
      cube.position.set(target.x, target.y, 0);
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
      map.addBlocks(blocks);

      // TODO: map shenanigans...
      var x, y, cell, cube;
      for (y = MAP.th - 1; y >= 0; y--) {
        for (x = 0; x < MAP.tw; x++) {
          cell = map.getCell(x, y);
          if (cell === 1) {
            cube = assets.cubeSolid();
          } else {
            cube = assets.cubeEmpty();
          }
          cube.position.set(x, y, 0);
          scene.add(cube);
        }
      }
    },

    isComplete: function () {
      return targets.length <= 0;
    }

  };
}();
