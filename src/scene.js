'use strict';

var _ = require('underscore'),
	THREE = require('three');

// returns a soft edge for the camera position looking at the world
var edge = function () {
	var easing = require('bezier-easing'),
		easeDown = easing(0.585, 0.000, 0.940, 0.805),
		easeUp = easing(0.105, 0.510, 0.560, 1.000),
		ret = new THREE.Vector2(),
		pad = 6,
		dimensions = new THREE.Vector2(),
		hard = new THREE.Vector2(),
		minsoft = new THREE.Vector2(),
		maxsoft = new THREE.Vector2();

	var edge = {
		set: function (width, height) {
			dimensions.set(width, height);
			hard.set(14, 14);
			minsoft.set(hard.x + pad, hard.y + pad);
			maxsoft.set(dimensions.x - hard.x - pad, dimensions.y - hard.y - pad);
		},
		get: function (v) {
			ret.set(v.x, v.y);
			if (ret.x < minsoft.x) {
				ret.x = hard.x + easeDown.get(ret.x / minsoft.x) * pad;
			}
			if (ret.x > maxsoft.x) {
				ret.x = maxsoft.x + (easeUp.get((ret.x - maxsoft.x) / minsoft.x)) * pad;
			}
			if (ret.y < minsoft.y) {
				ret.y = hard.y + easeDown.get(ret.y / minsoft.y) * pad;
			}
			if (ret.y > maxsoft.y) {
				ret.y = maxsoft.y + (easeUp.get((ret.y - maxsoft.y) / minsoft.y)) * pad;
			}
			return ret;
		}
	};
	// defaults
	edge.set(64, 53);
	return edge;
}();

const zoom = 26;

var Scene = function () {
	var scene = new THREE.Scene(),
		cam = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, zoom - 9, zoom),
		// dlight = new THREE.DirectionalLight(0xffffff, 1),
		alight = new THREE.AmbientLight(0xffffff),
		renderer = new THREE.WebGLRenderer();

	cam.position.set(0, 0, zoom);
	cam.updateProjectionMatrix();

	scene.add(cam);
	// scene.add(dlight);
	scene.add(alight);

	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(0x3e3e3e, 1);
	document.body.appendChild(renderer.domElement);

	this.render = function () {
		renderer.render(scene, cam);
	};

	this.add = function (m) {
		scene.add(m);
	};

	this.follow = function (p) {
		var e;
		return function (p) {
			e = edge.get(p);
			cam.position.set(e.x, e.y, zoom);
		};
	}();

	this.remove = function (m) {
		scene.remove(m);
	};

	this.clear = function () {
		var children = _.clone(scene.children);
		_.each(children, function (child) {
			scene.remove(child);
		});
	};

};

module.exports = Scene;
