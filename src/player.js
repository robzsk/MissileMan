'use strict';
var THREE = require('three'),
	thrust = require('./engine/thrust'),
	Entity = require('./engine/entity'),
	Morph = require('./morph'),
	Flame = require('./particles/flame'),
	Explosion = require('./particles/explosion');

const MISSILE_MAX_SPEED = 10.0,
	MISSILE_MAX_ANGULAR_SPEED = 5.0,
	MISSILE_TORQUE = 50.0,
	MISSILE_TRUST = new THREE.Vector3(0, 50.0, 0),
	MAN_MAX_XSPEED = 10,
	MAN_MAX_YSPEED = 10,
	RUN_FORCE = 50,
	JUMP_FORCE = 1500,
	GRAVITY = 100;

const RADIUS = 0.2;
const points = [
	{ x: 0, y: 0.32, z: 0, r: RADIUS, rs: RADIUS * RADIUS },
	{ x: 0, y: -0.32, z: 0, r: RADIUS, rs: RADIUS * RADIUS }
];

var Player = function (color) {
	var entity = new Entity(points),
		dead = false,
		input,
		flame = new Flame(color),
		explosion = new Explosion(color);

	var keys = {
		left: false, right: false, jump: false, morph: false,
		reset: function () {
			this.left = this.right = this.jump = this.morph = false;
		}
	};

	var changeToMan = function () {
		entity.setRotation();
		flame.stop();
	};

	var changeToMissile = function () {
		const tolerance = 0.75;
		var v = entity.velocity();
		if (v.length() < tolerance) {
			entity.setRotation();
		} else {
			entity.setRotation(-Math.atan2(v.x, v.y));
		}
		flame.start();
	};

	var morph = new Morph(changeToMan, changeToMissile);

	var applyForce = function (torque, force) {
		if (morph.isMan()) {
			if (keys.left) {
				force.x -= RUN_FORCE;
			} else if (keys.right) {
				force.x += RUN_FORCE;
			}
			if (keys.jump) {
				force.y += JUMP_FORCE;
			} else {
				force.y -= GRAVITY;
			}
		} else {
			if (keys.left) {
				torque.z += MISSILE_TORQUE;
			} else if (keys.right) {
				torque.z -= MISSILE_TORQUE;
			}
			thrust(force, entity.rotation(), MISSILE_TRUST);
		}
	};

	var applyDamping = function (v, av) {
		if (morph.isMan()) {
			av.z = 0;// cancel all angular velocity as man
			v.x = v.x < 0 ? Math.max(v.x, -MAN_MAX_YSPEED) : Math.min(v.x, MAN_MAX_YSPEED);
			v.y = v.y < 0 ? Math.max(v.y, -MAN_MAX_YSPEED) : Math.min(v.y, MAN_MAX_YSPEED);
			if (!keys.left && !keys.right) {
				v.x *= 0.8;
			} else if ((keys.left && v.x > 0) || (keys.right && v.x < 0)) {
				v.x *= 0.75;
			}
		} else {
			av.z = av.z < 0 ? Math.max(av.z, -MISSILE_MAX_ANGULAR_SPEED) : Math.min(av.z, MISSILE_MAX_ANGULAR_SPEED);
			if (!keys.left && !keys.right) {
				av.z *= 0.9;
			}
			if (v.length() > MISSILE_MAX_SPEED) {
				v.normalize();
				v.multiplyScalar(MISSILE_MAX_SPEED);
			}
		}
	};

	var handleInput = function (m) {
		keys.left = m.left;
		keys.right = m.right;
		keys.jump = m.jump;

		if (!keys.morph && m.morph) {
			morph.go();
		}
		keys.morph = m.morph;
	};

	this.update = function (ticks, dt) {
		if (!dead) {
			input.update(ticks);
			morph.update();
			entity.update(dt, applyForce, applyDamping);
		}

		flame.update(entity.getPoints()[1], entity.rotation().z);
		explosion.update();
	};

	this.getScale = function () {
		return morph.getScale();
	};

	this.isDead = function () {
		return dead;
	};

	this.setInput = function (i) {
		i.removeAllListeners('input.move');
		if (input) {
			input.removeAllListeners('input.move'); // there can be only one
		}
		input = i;
		input.reset();
		input.on('input.move', handleInput);
	};

	this.setSpawn = function (spawn) {
		entity.reset(spawn.x, spawn.y);
	};

	this.kill = function () {
		dead = true;
		input.removeListener('input.move', handleInput);
		flame.stop();
		explosion.start(entity.position());
	};

	this.revive = function () {
		dead = false;
		keys.reset();
		morph.reset();
		flame.clear();
		explosion.clear();
		this.setInput(input);
	};

	this.getSerializedInput = function () {
		return input.serialize();
	};

	this.getFlame = function () {
		return flame.particleSystem;
	};

	this.getExplosion = function () {
		return explosion.particleSystem;
	};

	this.position = entity.position;
	this.rotation = entity.rotation;
	this.getPoints = entity.getPoints;
	this.handleCollision = entity.handleCollision;
	this.isMan = morph.isMan;

};

module.exports = Player;
