var MISSILE_MAX_SPEED = 1.0,
  MISSILE_TORQUE = 0.8,
  MISSILE_TORQUE_DAMPING = 0.4,
  MISSILE_TRUST = new THREE.Vector3(0, 5.0, 0);

var points = [
  { x: 0, y: 0.175, z: 0, r: 0.25 },
  { x: 0, y: -0.175, z: 0, r: 0.25 }
];

module.exports = function (conf) {
  'use strict';

  var entity = require('./physics/entity')(),
    thrust = require('./physics/thrust');

  var left = false, right = false, jump = false;

  entity.forces = function (state, force, torque) {
    var sa = state.angularVelocity;

    thrust(force, state.orientation, MISSILE_TRUST);

    // damping
    torque.x -= sa.x * MISSILE_TORQUE_DAMPING;
    torque.y -= sa.y * MISSILE_TORQUE_DAMPING;
    torque.z -= sa.z * MISSILE_TORQUE_DAMPING;
  };

  entity.control = function (state, force, torque) {
    if (left) {
      torque.z += MISSILE_TORQUE;
    }
    if (right) {
      torque.z -= MISSILE_TORQUE;
    }
  };

  entity.limitMomentum = function (state) {
    var sm = state.momentum;
    if (sm.length() > MISSILE_MAX_SPEED) {
      sm.normalize();
      sm.multiplyScalar(MISSILE_MAX_SPEED);
    }
  };

  var handleInput = function (e, m) {
    left = m.left;
    right = m.right;
    jump = m.jump;
  };

  $(conf.input).on('input.move', handleInput);

  return {
    position: entity.position,
    orientation: entity.orientation,
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
