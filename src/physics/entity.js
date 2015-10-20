module.exports = function () {
  'use strict';

  var radius = 0.425;
  var radiusSq = Math.pow(radius, 2);

  var rotation = new THREE.Euler();
  var velocity = new THREE.Vector2(0, 0);
  var position = new THREE.Vector2(0, 0);

  const detectCollision = function () {
    var pointToPos = new THREE.Vector2(), depth, offset, distSquared;
    return function (nearestPointOnLine) {
      pointToPos.copy(position)
        .sub(nearestPointOnLine);
      distSquared = pointToPos.lengthSq();
      if (distSquared < radiusSq) {
        depth = radius - Math.sqrt(distSquared);
        offset = pointToPos.normalize().multiplyScalar(depth);
        position.add(offset);
        velocity.sub(offset);
      }
    };
  }();

  const integrate = function () {
    var tmp = new THREE.Vector2();
    return function (dt, points, lines) {
      tmp.set(0, 0);
      entity.forces(rotation, tmp);
      tmp.multiplyScalar(dt);
      velocity.add(tmp);
      entity.limitVelocity(velocity);
      tmp.copy(velocity).multiplyScalar(dt);
      position.add(tmp);
      _.each(lines, function (l) {
        detectCollision(l.nearestPoint(position));
      });
    };
  }();

  var entity = {
    update: function (dt, points, lines) {
      integrate(dt, points, lines);
    },

    // override these
    forces: function (r, force) {},
    limitVelocity: function (v) {},

    setPosition: function (x, y) {
      position.set(x, y, 0);
    },

    position: function () {
      var p = new THREE.Vector3();
      return function () {
        return p.set(position.x, position.y, 0);
      };
    }(),

    rotation: function () {
      var r = new THREE.Euler();
      return function () {
        return r.copy(rotation);
      };
    }()

  };

  return entity;
};
