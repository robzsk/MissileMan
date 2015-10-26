module.exports = function () {
  'use strict';

  const assets = require('./assets'),
    sceneFactory = require('./scene'),
    mapFactory = require('./physics/map');

  var players = [],
    targets = [],
    map = mapFactory(),
    playerToWatch,
    MAP = { tw: 64, th: 48 }, // TODO: this is also hard coded in map.js. we don't want these shenanigans
    scene = sceneFactory($('#canvas'));

  // TODO: move this somewhere else
  var getLinesForTarget = function () {}();

  var world = {
    update: function (ticks, step) {
      var getLines = require('./physics/line').getBoxLines;

      _.each(players, function (p) {
        p.update(ticks, step);

        p.checkCollides(map.getLines(p));

        // TODO: use a map layer instead. handle the same as a map
        // return the coordinates of the collision and figure out which box was hit
        _.every(targets, function (t) {
          if (p.checkCollides(getLines(t.x, t.y))) {
            scene.remove(p.avatar);
            scene.remove(t.avatar);
            players = _.without(players, p);
            targets = _.without(targets, t);
            $(world).trigger('world.player.killed', p);
            return false;
          }
          return true;
        });

      });
    },

    render: function (dt) {
      _.each(players, function (p) {
        p.avatar.rotation.x = p.avatar.rotation.y = p.avatar.rotation.z = 0;
        p.avatar.rotation.z = p.rotation().z;
        p.avatar.position.copy(p.position());
        p.avatar.scale.set(p.getScale(), p.getScale(), p.getScale());
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
  return world;
}();
