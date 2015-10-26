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

  var event = require('./engine/event'),
    thrust = require('./engine/thrust'),
    entity = require('./engine/entity')(points),
    morph = require('./morph')();

  var keys = {
    left: false, right: false, jump: false, morph: false,
    reset: function () {
      this.left = this.right = this.jump = this.morph = false;
    }
  };

  event(morph).on('morph.changeToMan', function () {
    entity.setRotation();
  });

  event(morph).on('morph.changeToMissile', function () {
    const tolerance = 0.75;
    var v = entity.velocity();
    if (v.length() < tolerance) {
      entity.setRotation();
    } else {
      entity.setRotation(-Math.atan2(v.x, v.y));
    }
  });

  event(entity).on('entity.applyForce', function (rotation, force) {
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

  });

  event(entity).on('entity.applyDamping', function (v) {
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
  });

  var handleInput = function (e, m) {
    keys.left = m.left;
    keys.right = m.right;
    keys.jump = m.jump;

    if (!keys.morph && m.morph) {
      morph.go();
    }
    keys.morph = m.morph;
  };

  $(conf.input).on('input.move', handleInput);

  return {
    position: entity.position,
    rotation: entity.rotation,

    detatchInput: function () {
      $(conf.input).off('input.move', handleInput);
    },

    reset: function () {
      morph.reset();
      keys.reset();
      entity.reset(conf.pos.x, conf.pos.y);
    },

    update: function (ticks, dt) {
      conf.input.update(ticks);
      morph.update();
      entity.update(dt);
    },

    getScale: function () {
      return morph.getScale();
    },

    checkCollides: entity.checkCollides

  };
};
