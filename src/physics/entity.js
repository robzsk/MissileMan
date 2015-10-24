module.exports = function () {
  'use strict';

  var rotation = new THREE.Euler();
  var velocity = new THREE.Vector2(0, 0);
  var position = new THREE.Vector2(0, 0);

  const detectCollision = function () {
    var pointToPos = new THREE.Vector2(), depth, offset, distSquared, cNormal = new THREE.Vector2();
    return function (point, nearestPointOnLine, lineNormal) {
      pointToPos.copy(point)
        .sub(nearestPointOnLine);
      cNormal.copy(pointToPos).normalize();
      if (cNormal.dot(lineNormal) >= 0) { // behind the line?
        distSquared = pointToPos.lengthSq();
        if (distSquared < point.rs) {
          depth = point.r - Math.sqrt(distSquared);
          offset = pointToPos.normalize().multiplyScalar(depth);
          position.add(offset);
          velocity.sub(cNormal.multiplyScalar(velocity.dot(cNormal)));
          entity.onCollision(lineNormal);
        }
      }
    };
  }();

  const handleCollisions = function (points, lines) {
    var pointToWorld = new THREE.Vector3(),
      bodyToWorld = new THREE.Matrix4();
    return function (points, lines) {
      pointToWorld.set(position.x, position.y, 0);
      bodyToWorld.makeRotationFromEuler(rotation)
        .setPosition(pointToWorld);
      _.each(lines, function (l) {
        _.each(points, function (p) {
          pointToWorld.set(p.x, p.y, 0)
            .applyMatrix4(bodyToWorld);
          pointToWorld.r = p.r; // radius
          pointToWorld.rs = p.rs; // radius squared
          detectCollision(pointToWorld, l.nearestPoint(pointToWorld), l.n);
        });
      });
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
      if (lines.length > 0) {
        handleCollisions(points, lines);
      }
    };
  }();

  var entity = {
    update: function (dt, points, lines) {
      integrate(dt, points, lines);
    },

    // override these
    forces: function (r, force) {},
    limitVelocity: function (v) {},
    onCollision: function () {},

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
