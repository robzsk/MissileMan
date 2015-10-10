module.exports = function () {
  'use strict';
  var position = new THREE.Vector3(),
    momentum = new THREE.Vector3(),
    orientation = new THREE.Quaternion(),
    angularMomentum = new THREE.Vector3(),
    velocity = new THREE.Vector3(),
    spin = new THREE.Quaternion(),
    bodyToWorld = new THREE.Matrix4(),
    size,
    mass,
    inverseMass,
    inertiaTensor,
    inverseInertiaTensor;

  return {
    recalcuate: function () {},

    copyFrom: function (other) {},

    eq: function (other) {},

    neq: function (other) {
      return !this.eq(other);
    },

    compare: function (other) {},

    setPosition: function (p) {},

    resetOrientation: function () {},

    alignOrentationToMomentum() {}

  };
};
