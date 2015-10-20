const MISSILE_MAX_SPEED = 5.0,
  MISSILE_TORQUE = 3 * (Math.PI / 180),
  MISSILE_TRUST = new THREE.Vector3(0, 5.0, 0);

const points = [
  { x: 0, y: 0.175, z: 0, r: 0.25 },
  { x: 0, y: -0.175, z: 0, r: 0.25 }
];

module.exports = function (conf) {
  'use strict';

  const entity = require('./physics/entity')(),
    thrust = require('./physics/thrust');

  var left = false, right = false, jump = false;

  entity.forces = function (rotation, force) {
    if (left) {
      rotation.z += MISSILE_TORQUE;
    } else if (right) {
      rotation.z -= MISSILE_TORQUE;
    }

    var q = new THREE.Quaternion();
    q.setFromEuler(rotation);
    thrust(force, q, MISSILE_TRUST);
  };

  entity.control = function (state, force, torque) {
    if (left) {
      torque.z += MISSILE_TORQUE;
    }
    if (right) {
      torque.z -= MISSILE_TORQUE;
    }
  };

  entity.limitVelocity = function (v) {
    if (v.length() > MISSILE_MAX_SPEED) {
      v.normalize();
      v.multiplyScalar(MISSILE_MAX_SPEED);
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
