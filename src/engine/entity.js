'use strict';

var _ = require('underscore'),
	THREE = require('three');

var Entity = function (points) {
	var rotation = new THREE.Euler(),
		angularVelocity = new THREE.Vector3(0, 0, 0),
		velocity = new THREE.Vector2(0, 0),
		position = new THREE.Vector2(0, 0);

	var pointsToWorld = [];

	var toWorld = function () {
		var pointToWorld = new THREE.Vector3(),
			bodyToWorld = new THREE.Matrix4();
		_.each(points, function (p) {
			var pw = new THREE.Vector3();
			pw.r = p.r;
			pw.rs = p.rs;
			pointsToWorld.push(pw);
		});
		return function () {
			bodyToWorld.makeRotationFromEuler(rotation).setPosition(position);
			_.each(pointsToWorld, function (p, n) {
				p.set(points[n].x, points[n].y, 0).applyMatrix4(bodyToWorld);
			});
		};
	}();

	this.update = function () {
		var force = new THREE.Vector2(), torque = new THREE.Vector3();
		return function (dt, applyForce, applyDamping) {
			force.set(0, 0);
			torque.set(0, 0, 0);

			applyForce(torque, force, rotation);

			force.multiplyScalar(dt);
			velocity.add(force);

			torque.multiplyScalar(dt);
			angularVelocity.add(torque);

			applyDamping(velocity, angularVelocity);

			force.copy(velocity).multiplyScalar(dt);
			torque.copy(angularVelocity).multiplyScalar(dt);

			position.add(force);
			rotation.z += torque.z;

			toWorld();
		};
	}();

	this.reset = function (x, y) {
		position.set(x, y);
		angularVelocity.set(0, 0, 0);
		velocity.set(0, 0);
		rotation.set(0, 0, 0);
	};

	this.setRotation = function (z) {
		rotation.set(0, 0, z || 0);
	};

	this.position = function () {
		var p = new THREE.Vector3();
		return function () {
			return p.set(position.x, position.y, 0);
		};
	}();

	this.velocity = function () {
		var v = new THREE.Vector3();
		return function () {
			return v.set(velocity.x, velocity.y, 0);
		};
	}();

	this.rotation = function () {
		var r = new THREE.Euler();
		return function () {
			return r.copy(rotation);
		};
	}();

	this.getPoints = function () {
		return pointsToWorld;
	};

	this.handleCollision = function (collision) {
		position.add(collision.offset);
		velocity.sub(collision.normal.multiplyScalar(velocity.dot(collision.normal)));
	};
};

module.exports = Entity;
