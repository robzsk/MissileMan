'use strict';

module.exports = function () {
  var mesh = {};

  var createCube = function (color) {
    var geometry = new THREE.BoxGeometry(1, 1, 1),
      material = new THREE.MeshBasicMaterial({ color: color }),
      cube = new THREE.Mesh(geometry, material);
    return cube;
  };

  return {
    load: function () {
      var manager = new THREE.LoadingManager(),
        loader = new THREE.JSONLoader(manager);
      var loadMesh = function (name, mf) {
        loader.load('assets/' + mf + '.json', function (geom) {
          mesh[name] = new THREE.Mesh(geom, new THREE.MeshDepthMaterial());
        });
      };
      var me = this;
      manager.onLoad = function () {
        $(me).trigger('assets.loaded');
      };

      loadMesh('empty', 'empty');
      loadMesh('solid', 'solid');
    },

    // TODO: rename these or group them...
    cubeEmpty: function (n) {
      return mesh['empty'].clone();
    },

    cubeSolid: function () {
      return mesh['solid'].clone();
    },

    cubeTarget: function () {
      return createCube(0xac4442);
    },

    cubePlayer: function () {
      return createCube(0x0179d5);
    }

  };
}();
