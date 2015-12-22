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
				complete();
			};
			_.each(meshConfigs, function (c) {
				loadMesh(c);
			});

		};

		var getHex = function () {
			var c = new THREE.Color();
			return function (color) {
				c.setRGB(color.r, color.g, color.b);
				return c.getHexString();
			};
		}();

		this.model = {
			cubeEmpty: function (n) {
				return mesh['empty'].clone();
			},

			cubeSolid: function () {
				return mesh['solid'].clone();
			},

			cubeTarget: function () {
				var clone = {}, cl;
				var create = function (color) {
					var m = mesh['target'], hex = getHex(color);
					if (!clone[hex]) {
						cl = new THREE.Mesh(m.geometry.clone(), m.material.clone());
						cl.material.color.setRGB(color.r, color.g, color.b);
						clone[hex] = cl;
					}
					return clone[hex].clone();
				};
				return function (color) {
					return create(color);
				};
			}(),

			// TODO: there is a bit of repetition here. above and below
			man: function () {
				var clone = {}, cl;
				var create = function (color) {
					var m = mesh['man'], hex = getHex(color);
					if (!clone[hex]) {
						cl = new THREE.Mesh(m.geometry.clone(), m.material.clone());
						cl.material.materials[1].color.setRGB(color.r, color.g, color.b);
						clone[hex] = cl;
					}
					return clone[hex].clone();
				};
				return function (color) {
					return create(color);
				};
			}(),

			missile: function () {
				var clone = {}, cl;
				var create = function (color) {
					var m = mesh['man'], hex = getHex(color);
					if (!clone[hex]) {
						cl = new THREE.Mesh(m.geometry.clone(), m.material.clone());
						cl.rotation.set(0, 0, Math.PI);
						cl.updateMatrix();
						cl.geometry.applyMatrix(cl.matrix);
						cl.material.materials[1].color.setRGB(color.r, color.g, color.b);
						clone[hex] = cl;
					}
					return clone[hex].clone();
				};
				return function (color) {
					return create(color);
				};
			}()
		};
	};

	return new Assets();
}();
