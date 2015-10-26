module.exports = function (points) {
  'use strict';

  var event = require('./event');

  var rotation = new THREE.Euler(),
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

  var entity = {
    update: function () {
      var force = new THREE.Vector2();
      return function (dt) {
        force.set(0, 0);
        event(entity).trigger('entity.applyForce', [rotation, force]);
        force.multiplyScalar(dt);
        velocity.add(force);
        event(entity).trigger('entity.applyDamping', [velocity]);
        force.copy(velocity).multiplyScalar(dt);
        position.add(force);
        toWorld();
      };
    }(),

    reset: function (x, y) {
      position.set(x, y, 0);
      velocity.set(0, 0, 0);
      rotation.set(0, 0, 0);
    },

    setRotation: function (z) {
      rotation.set(0, 0, z || 0);
    },

    position: function () {
      var p = new THREE.Vector3();
      return function () {
        return p.set(position.x, position.y, 0);
      };
    }(),

    velocity: function () {
      var v = new THREE.Vector3();
      return function () {
        return v.set(velocity.x, velocity.y, 0);
      };
    }(),

    rotation: function () {
      var r = new THREE.Euler();
      return function () {
        return r.copy(rotation);
      };
    }(),

    checkCollides: function () {
      var collision, found;
      return function (lines) {
        found = false;
        _.each(lines, function (l) {
          _.each(pointsToWorld, function (p) {
            collision = l.detectCollision(p);
            if (collision) {
              position.add(collision.offset);
              velocity.sub(collision.normal.multiplyScalar(velocity.dot(collision.normal)));
              found = true;
            }
          });
        });
        return found;
      };
    }()

  };

  return entity;
};
