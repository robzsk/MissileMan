'use strict';
var thrust = require('./engine/thrust'),
  Entity = require('./engine/entity'),
  Morph = require('./morph');

const MISSILE_MAX_SPEED = 10.0,
  MISSILE_TORQUE = 5 * (Math.PI / 180),
  MISSILE_TRUST = new THREE.Vector3(0, 50.0, 0),
  MAN_MAX_XSPEED = 10,
  MAN_MAX_YSPEED = 10,
  RUN_FORCE = 50,
  JUMP_FORCE = 1500,
  GRAVITY = 100;

const RADIUS = 0.25;
const points = [
  { x: 0, y: 0.175, z: 0, r: RADIUS, rs: RADIUS * RADIUS },
  { x: 0, y: -0.175, z: 0, r: RADIUS, rs: RADIUS * RADIUS }
];

var Player = function () {
  var entity = new Entity(points),
    dead = false,
    input;

  var keys = {
    left: false, right: false, jump: false, morph: false,
    reset: function () {
      this.left = this.right = this.jump = this.morph = false;
    }
  };

  var changeToMan = function () {
    entity.setRotation();
  };

  var changeToMissile = function () {
    const tolerance = 0.75;
    var v = entity.velocity();
    if (v.length() < tolerance) {
      entity.setRotation();
    } else {
      entity.setRotation(-Math.atan2(v.x, v.y));
    }
  };

  var morph = new Morph(changeToMan, changeToMissile);

  var applyForce = function (rotation, force) {
    if (morph.isMan()) {
      if (keys.left) {
        force.x -= RUN_FORCE;
      }else if (keys.right) {
        force.x += RUN_FORCE;
      }
      if (keys.jump) {
        force.y += JUMP_FORCE;
      } else {
        force.y -= GRAVITY;
      }
    } else {
      if (keys.left) {
        rotation.z += MISSILE_TORQUE;
      } else if (keys.right) {
        rotation.z -= MISSILE_TORQUE;
      }
      thrust(force, rotation, MISSILE_TRUST);
    }
  };

  var applyDamping = function (v) {
    if (morph.isMan()) {
      v.x = v.x < 0 ? Math.max(v.x, -MAN_MAX_YSPEED) : Math.min(v.x, MAN_MAX_YSPEED);
      v.y = v.y < 0 ? Math.max(v.y, -MAN_MAX_YSPEED) : Math.min(v.y, MAN_MAX_YSPEED);

      if (!keys.left && !keys.right) {
        v.x *= 0.8;
      } else if ((keys.left && v.x > 0) || (keys.right && v.x < 0)) {
        v.x *= 0.75;
      }
    } else {
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
    input.update(ticks);
    morph.update();
    entity.update(dt, applyForce, applyDamping);
  };

  this.getScale = function () {
    return morph.getScale();
  };

  this.isDead = function () {
    return dead;
  };

  this.kill = function () {
    dead = true;
    input.removeListener('input.move', handleInput);
  };

  this.set = function (conf) {
    dead = false;
    keys.reset();
    morph.reset();
    input = conf.input;
    // TODO: probably should do this somwhere else
    input.removeAllListeners('input.move'); // there can be only one
    input.on('input.move', handleInput);
    entity.reset(conf.spawn.x, conf.spawn.y);
  };

  this.position = entity.position;
  this.rotation = entity.rotation;
  this.getPoints = entity.getPoints;
  this.handleCollision = entity.handleCollision;

};

module.exports = Player;
