const THREE = require('three');

module.exports = points => {
  const bodyToWorld = new THREE.Matrix4();
  const pointsToWorld = [];
  points.forEach(p => {
    const pw = new THREE.Vector3();
    pw.r = p.r;
    pw.rs = p.rs;
    pointsToWorld.push(pw);
  });
  const update = (rotation, position) => {
    bodyToWorld.makeRotationFromEuler(rotation).setPosition(position);
    pointsToWorld.forEach((p, n) => {
      p.set(points[n].x, points[n].y, 0).applyMatrix4(bodyToWorld);
    });
  };

  const get = () => pointsToWorld;

  return {
    update,
    get,
  };
};
