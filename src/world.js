'use strict';

var _ = require('underscore'),
  util = require('util'),
  EventEmitter = require('events').EventEmitter;

var World = function () {
  const assets = require('./assets'),
    Scene = require('./scene'),
    Map = require('./engine/map'),
    getLines = require('./engine/line').getBoxLines;

  var self = this,
    scene = new Scene(),
    map = new Map(),
    players = [],
    targets = [],
    playerToWatch;

  EventEmitter.call(this);

  this.update = function (ticks, step) {
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
          self.emit('world.player.killed', p);
          return false;
        }
        return true;
      });

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
      scene.follow(playerToWatch.position);
    }
    scene.render();
  };

  this.clear = function () {
    players = [];
    targets = [];
    map.clear();
    scene.clear();
  };

  this.addTarget = function (target) {
    var cube = assets.cubeTarget();
    targets.push(target);
    target.avatar = cube;
    cube.position.set(target.x, target.y, 0);
    scene.add(cube);
  };

  this.addPlayer = function (player, watch) {
    players.push(player);
    player.avatar = assets.cubePlayer();
    scene.add(player.avatar);
    if (watch) {
      playerToWatch = player.avatar;
    }
  };

  this.addBlocks = function (blocks) {
    map.addBlocks(blocks);

    _.each(blocks, function (row, y) {
      _.each(row, function (cell, x) {
        var cube;
        if (cell === 1) {
          cube = assets.cubeSolid();
        } else {
          cube = assets.cubeEmpty();
        }
        cube.position.set(x, y, 0);
        scene.add(cube);
      });
    });

  };

  this.isComplete = function () {
    return targets.length <= 0;
  };

};

util.inherits(World, EventEmitter);

module.exports = World;
