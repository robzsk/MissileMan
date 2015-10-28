'use strict';

var util = require('util'),
  EventEmitter = require('events').EventEmitter;

module.exports = function () {
  var mesh = {};

  const createCube = function (color) {
    var geometry = new THREE.BoxGeometry(1, 1, 1),
      material = new THREE.MeshBasicMaterial({ color: color }),
      cube = new THREE.Mesh(geometry, material);
    return cube;
  };

  var Assets = function () {
    var self = this;
    EventEmitter.call(this);

    this.load = function () {
      var manager = new THREE.LoadingManager(),
        loader = new THREE.JSONLoader(manager);
      var loadMesh = function (name, mf, color) {
        loader.load('assets/' + mf + '.json', function (geom) {
          mesh[name] = new THREE.Mesh(geom, color === undefined ?
            new THREE.MeshDepthMaterial() : new THREE.MeshBasicMaterial({ color: color }));
        });
      };
      manager.onLoad = function () {
        self.emit('assets.loaded');
      };

      loadMesh('empty', 'empty');
      loadMesh('solid', 'solid');
      loadMesh('target', 'solid', 0xac4442);
      loadMesh('player', 'player', 0x0179d5);
    };

    // TODO: rename these or group them...
    this.cubeEmpty = function (n) {
      return mesh['empty'].clone();
    };

    this.cubeSolid = function () {
      return mesh['solid'].clone();
    };

    this.cubeTarget = function () {
      return mesh['target'].clone();
    };

    this.cubePlayer = function () {
      return mesh['player'].clone();
    };
  };

  util.inherits(Assets, EventEmitter);

  return new Assets();
}();
