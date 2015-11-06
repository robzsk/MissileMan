'use strict';

var _ = require('underscore'),
  util = require('util'),
  EventEmitter = require('events').EventEmitter;

var World = function () {
  const assets = require('./assets'),
    Scene = require('./scene'),
    Map = require('./engine/map'),
    Line = require('./engine/line');

  var self = this,
    scene = new Scene(),
    map = new Map(),
    players = [],
    targets = [],
    playerToWatch;

  EventEmitter.call(this);

  var handleCollision = function (player, collision, type) {
    if (type === 2) {
      scene.remove(player.avatar);
      _.every(targets, function (t) {
        if (t.position.x === collision.x && t.position.y === collision.y) {
          scene.remove(t);
          map.removeBlock(collision.x, collision.y);
          targets = _.without(targets, t);
          return false;
        }
        return true;
      });
      if (!player.isDead()) {
        player.kill();
        if (player === playerToWatch) {
          self.emit('world.player.killed');
        }
      }
    }

  };

  this.update = function (ticks, step) {
    _.each(players, function (p) {
      if (!p.isDead()) {
        p.update(ticks, step);
        map.handleCollides(p, 1);
        map.checkCollides(p, 2, handleCollision);
      }
    });
  };

  this.render = function (dt) {
    _.each(players, function (p) {
      p.avatar.rotation.x = p.avatar.rotation.y = p.avatar.rotation.z = 0;
      p.avatar.rotation.z = p.rotation().z;
      p.avatar.position.copy(p.position());
      p.avatar.scale.set(p.getScale(), p.getScale(), p.getScale());
    });

    if (playerToWatch) {
      scene.follow(playerToWatch.avatar.position);
    }
    scene.render();
  };

  this.clear = function () {
    players = [];
    targets = [];
    map.clear();
    scene.clear();
  };

  this.addPlayer = function (player, watch) {
    players.push(player);
    player.avatar = assets.model.cubePlayer();
    scene.add(player.avatar);
    if (watch) {
      playerToWatch = player;
    }
  };

  this.addBlocks = function (blocks) {
    map.addBlocks(blocks);

    _.each(blocks, function (row, y) {
      _.each(row, function (cell, x) {
        var cube;
        if (cell === 1) {
          cube = assets.model.cubeSolid();
        } else if (cell === 2) {
          cube = assets.model.cubeTarget();
          targets.push(cube);
        } else {
          cube = assets.model.cubeEmpty();
        }
        cube.position.set(x, y, 0);
        scene.add(cube);
      });
    });

  };

  this.isComplete = function () {
    return targets.length === 0;
  };

};

util.inherits(World, EventEmitter);

module.exports = World;
