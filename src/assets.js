'use strict';

var _ = require('underscore'),
	THREE = require('three');

var modelFiles = require('./models.js');

var meshConfigs = [
	{ name: 'empty', file: 'empty', color: 0x3e3e3e },
	{ name: 'solid', color: 0x3e3e3e },
	{ name: 'target', file: 'solid', color: 0xac4442 },
	{ name: 'man', file: 'player' },
	{ name: 'missile', file: 'player' }
];

module.exports = function () {
	var mesh = {};

	var Assets = function () {
		this.load = function (onloaded) {
			var loader = new THREE.JSONLoader(), loaded = meshConfigs.length;
			var complete = function () {
				loaded -= 1;
				if (loaded <= 0) {
					onloaded();
				}
			};
			var loadMesh = function (conf) {
				var object = loader.parse(modelFiles[conf.file || conf.name]);
				var material = object.materials || new THREE.MeshBasicMaterial({ color: conf.color });
				if (material.length >= 1) {
					mesh[conf.name] = new THREE.Mesh(object.geometry, new THREE.MeshFaceMaterial(material));
				} else {
					mesh[conf.name] = new THREE.Mesh(object.geometry, material);
				}
				mesh[conf.name].castShadow = true;
				mesh[conf.name].receiveShadow = true;
				complete();
			};
			_.each(meshConfigs, function (c) {
				loadMesh(c);
			});

		};

		this.model = {
			cubeEmpty: function (n) {
				return mesh['empty'].clone();
			},

			cubeSolid: function () {
				return mesh['solid'].clone();
			},

			cubeTarget: function () {
				return mesh['target'].clone();
			},

			man: function (color) {
				var ret = mesh['man'].clone();
				// TODO: this wont work when we have different colored players on the screen
				ret.material.materials[1].color.setRGB(color.r, color.g, color.b);
				return ret;
			},

			missile: function (color) {
				var ret = mesh['missile'].clone();
				ret.rotation.set(0, 0, Math.PI);
				ret.updateMatrix();
				// TODO: this wont work when we have different colored players on the screen
				ret.material.materials[1].color.setRGB(color.r, color.g, color.b);
				ret.geometry.applyMatrix(ret.matrix);
				return ret;
			}
		};
	};

	return new Assets();
}();
