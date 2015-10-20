module.exports = function () {
  'use strict';

  var radius = 0.425;
  var radiusSq = Math.pow(radius, 2);

  var rotation = new THREE.Euler();
  var vel = new THREE.Vector2(0, 0);
  var pos = new THREE.Vector2(0, 0);
  var tmp = new THREE.Vector2();

  var detectCollision = function (nearestPointOnLine) {
    var pointToPos = new THREE.Vector2();
    pointToPos.copy(pos)
      .sub(nearestPointOnLine);
    var distSquared = pointToPos.lengthSq();
    if (distSquared < radiusSq) {
      var depth = radius - Math.sqrt(distSquared);
      var offset = pointToPos.normalize().multiplyScalar(depth);
      pos.add(offset);
      vel.sub(offset);
    }
  };

  var integrate = function (dt, lines) {
    tmp.set(0, 0);
    entity.forces(rotation, tmp);

    tmp.multiplyScalar(dt);
    vel.add(tmp);

    entity.limitVelocity(vel);

    tmp.copy(vel).multiplyScalar(dt);
    pos.add(tmp);

    _.each(lines, function (l) {
      detectCollision(l.nearestPoint(pos));
    });

  };

  var entity = {
    update: function (dt, points, lines) {
      integrate(dt, lines);
    },

    // override these
    forces: function (r, force) {},
    limitVelocity: function (v) {},

    setPosition: function (x, y) {
      pos.set(x, y, 0);
    },
    position: function () {
      var p = new THREE.Vector3();
      return function () {
        return p.set(pos.x, pos.y, 0);
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
