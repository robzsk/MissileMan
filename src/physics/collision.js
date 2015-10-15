module.exports = function () {
  'use strict';

  var planeFactory = require('./plane');

  var vsPlane = function () {
    var c = 100, k = 1000,
      relativeSpeed, penaltyForce,
      t = new THREE.Vector3(),
      velocity = t.clone(),
      sub = t.clone(),
      pn = t.clone();

    return function (state, force, torque, point, plane) {
      var penetration = plane.constant - point.dot(plane.normal);
      if (penetration > 0) {
        velocity.copy(state.angularVelocity);
        sub.set(point.x, point.y, 0).sub(state.position);
        velocity.cross(sub).add(state.momentum);

        relativeSpeed = -plane.normal.dot(velocity);
        penaltyForce = pn.copy(plane.normal).multiplyScalar(penetration * k);

        force.add(penaltyForce);
        torque.add(t.copy(point).sub(state.position).cross(penaltyForce));
      }
    };
  }();

  return {
    vsLine: function () {
      var n = new THREE.Vector3(),
        diff = n.clone(),
        ptt = n.clone(),
        np = n.clone();
      return function (state, force, torque, point, line) {
        var nearestPt = line.nearestPoint(point);
        diff.set(point.x - nearestPt.x, point.y - nearestPt.y, 0);
        if (diff.length() < point.r) {
          n.copy(diff).normalize();
          ptt.copy(n).multiplyScalar(point.r);
          np.copy(point).sub(ptt);
          vsPlane(state, force, torque, np, planeFactory(n, nearestPt));
        }
      };
    }()
  };
}();
