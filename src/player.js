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

module.exports = function (conf) {
  'use strict';

  const thrust = require('./physics/thrust');

  var entity = require('./physics/entity')();
  var left = false, right = false, jump = false;
  var isMan = false;

  entity.forces = function (rotation, force) {
    if (isMan) {
      if (left) {
        force.x -= RUN_FORCE;
      }else if (right) {
        force.x += RUN_FORCE;
      }
      if (jump) {
        force.y += JUMP_FORCE;
      } else {
        force.y -= GRAVITY;
      }
    } else {
      if (left) {
        rotation.z += MISSILE_TORQUE;
      } else if (right) {
        rotation.z -= MISSILE_TORQUE;
      }
      thrust(force, rotation, MISSILE_TRUST);
    }

  };

  entity.onCollision = function (lineNormal) {},

  entity.limitVelocity = function (v) {
    if (isMan) {
      v.x = v.x < 0 ? Math.max(v.x, -MAN_MAX_YSPEED) : Math.min(v.x, MAN_MAX_YSPEED);
      v.y = v.y < 0 ? Math.max(v.y, -MAN_MAX_YSPEED) : Math.min(v.y, MAN_MAX_YSPEED);

      if (!left && !right) {
        v.x *= 0.8;
      } else if ((left && v.x > 0) || (right && v.x < 0)) {
        v.x *= 0.75;
      }
    } else {
      if (v.length() > MISSILE_MAX_SPEED) {
        v.normalize();
        v.multiplyScalar(MISSILE_MAX_SPEED);
      }
    }

  };

  const handleInput = function (e, m) {
    left = m.left;
    right = m.right;
    jump = m.jump;
  };

  $(conf.input).on('input.move', handleInput);

  return {
    position: entity.position,
    rotation: entity.rotation,
    detatchInput: function () {
      $(conf.input).off('input.move', handleInput);
    },

    reset: function () {
      jump = left = right = false;
      entity.setPosition(conf.pos.x, conf.pos.y);
    },

    update: function (ticks, dt, lines) {
      conf.input.update(ticks);
      entity.update(dt, points, lines);
    }
  };
};
