module.exports = function () {
  'use strict';

  // TODO: line.js needs refactor
  var line = require('./physics/line');

  var world;
  var MAP = { tw: 64, th: 48 },
    TILE = 1;

  var tcell = function (tx, ty) { return cells[tx + (ty * MAP.tw)];};

  var players = [],
    targets = [],
    cells = {},
    playerToWatch;

  var assets = require('./assets'),
    sceneFactory = require('./scene');

  var scene = sceneFactory($('#canvas'));

  return {
    update: function (ticks, step) {
      _.each(players, function (p) {
        // TODO: refactor this
        var sx = Math.floor(p.x),
          sy = Math.floor(p.y);
        var mask = 0;
        mask += tcell(sx - 1, sy - 1) ? 4 : 0;
        mask += tcell(sx, sy - 1) ? 2 : 0;
        mask += tcell(sx - 1, sy - 1) ? 1 : 0;
        var lines = line.makeLines(mask, 'bottom');
        var linesToSend = [];
        // _.each(lines, function (l) {
        //   linesToSend.push(line.createLine(
        //   {a: [sx - 1 + l.a[0], sy - 1 + l.a[1]],
        //   b: [sx - 1 + l.b[0], sy - 1 + l.b[1]]}
        //   ));
        // });

        linesToSend.push(line.createLine(
          {a: [1, 1], b: [4, 1]}
        ));

        p.update(ticks, step, linesToSend);
        // --end refactor this

      });
    },

    render: function (dt) {
      _.each(players, function (p) {
        // p.avatar.position.set(p.x, p.y, 0);

        // TODO: move this
        var rfAngle, rkAxis = {};
        var q = p.orientation;
        var fSqrLength = q.x * q.x + q.y * q.y + q.z * q.z;
        if ( fSqrLength > 0.0) {
          rfAngle = 2.0 * Math.acos(q.w);
          var fInvLength = 1.0 / Math.sqrt(fSqrLength);
          rkAxis.x = p.x * fInvLength;
          rkAxis.y = p.y * fInvLength;
          rkAxis.z = p.z * fInvLength;
        } else {
          rfAngle = 0.0;
          rkAxis.x = 1.0;
          rkAxis.y = 0.0;
          rkAxis.z = 0.0;
        }

        // p.avatar.setRotationFromQuaternion(p.orientation);
        var qq = new THREE.Quaternion();
        qq.setFromAxisAngle(rkAxis, rfAngle);
        // p.avatar.setRotationFromQuaternion(qq);

        p.avatar.setRotationFromQuaternion(p.orientation);
        p.avatar.position.set(p.x, p.y, 0);
        p.avatar.matrixAutoUpdate = false;
        p.avatar.updateMatrix();

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
      cells = blocks;
      var x, y, cell, cube;
      for (y = MAP.th - 1; y >= 0; y--) {
        for (x = 0; x < MAP.tw; x++) {
          cell = tcell(x, y);
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
