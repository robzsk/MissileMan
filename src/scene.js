'use strict';

var _ = require('underscore'),
	THREE = require('three'),
	Flame = require('./flame');

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

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
const zoom = 1;
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

module.exports = function () {
	var scene = new THREE.Scene(),
		// cam = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 26 - 9, 26),
		cam = new THREE.OrthographicCamera(windowWidth * zoom / -2, windowWidth * zoom / 2, windowHeight * zoom / 2, windowHeight * zoom / -2, 0, 1),

		// cam = new THREE.PerspectiveCamera(40, WIDTH / HEIGHT, 1, 10000),

		ambientLight = new THREE.AmbientLight(0xffffff),
		renderer = new THREE.WebGLRenderer({ antialias: true });

	cam.position.set(0, 0, 10);
	cam.zoom = 28;
	// cam.position.z = 300;
	cam.updateProjectionMatrix();

	scene.add(cam);
	scene.add(ambientLight);

	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	return {
		getCameraPosition: function () {
			return cam.position;// TODO: return a copy
		},

		render: function () {
			renderer.render(scene, cam);
		},

		add: function (m) {
			scene.add(m);
		},

		follow: function (p) {
			var e;
			return function (p) {
				e = edge.get(p);
				cam.position.set(e.x, e.y, zoom);
			};
		}(),

		remove: function (m) {
			scene.remove(m);
		},

		clear: function () {
			var children = _.clone(scene.children);
			_.each(children, function (child) {
				if (child !== ambientLight) {
					scene.remove(child);
				}

			});
		}
	};
}();
