module.exports = function () {
  'use strict';

  var assets,
    manager = new THREE.LoadingManager(),
    loader = new THREE.JSONLoader(manager),
    mesh = {};

  var loadMesh = function (name, mf) {
    loader.load('assets/' + mf + '.json', function (geom) {
      mesh[name] = new THREE.Mesh(geom, new THREE.MeshDepthMaterial());
    });
  };

  manager.onLoad = function () {
    $(assets).trigger('assets.loaded');
  };

  loadMesh('empty', 'empty');
  loadMesh('solid', 'solid');

  var createCube = function (color) {
    var geometry = new THREE.BoxGeometry(1, 1, 1),
      material = new THREE.MeshBasicMaterial({ color: color }),
      cube = new THREE.Mesh(geometry, material);
    return cube;
  };

  assets = {
    empty: function (n) {
      return mesh['empty'].clone();
    },

    solid: function () {
      return mesh['solid'].clone();
    },

    target: function () {
      return createCube(0xac4442);
    },

    player: function () {
      return createCube(0x0179d5);
    }

  };

  return assets;

}();
