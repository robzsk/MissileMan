'use strict';

var easing = require('bezier-easing');

var Morph = function (changeToMan, changeToMissile) {
	const ttl = 7;

	var easeDown = easing(0, 0, 1, 1),
		easeUp = easing(0.25, 0.25, 0.5, 3.5),
		n = 0,
		scale = 1,
		down = false,
		up = false,
		isMan = true;

	var doMorph = function () {
		if (isMan) {
			isMan = false;
			changeToMissile();
		} else {
			isMan = true;
			changeToMan();
		}
	};

	var canMorph = function () {
		return !down && !up;
	};

	this.reset = function () {
		scale = 1;
		n = 0;
		isMan = true;
		up = down = false;
	};

	this.isMan = function () {
		return isMan;
	};

	this.getScale = function () {
		// if scale is zero three.js throws
		// Matrix3.getInverse(): can't invert matrix, determinant is 0
		return scale || 0.00001;
	};

	this.go = function () {
		if (canMorph()) {
			down = true;
		}
	};

	this.update = function () {
		if (down) {
			scale = easeDown.get(n / ttl);
			n -= 1;
			if (n < 0) {
				down = false;
				up = true;
				n = 0;
				doMorph();
			}
		}
		if (up) {
			scale = easeUp.get(n / ttl);
			n += 1;
			if (n > ttl) {
				up = false;
				n = ttl;
			}
		}
	};

};

module.exports = Morph;
