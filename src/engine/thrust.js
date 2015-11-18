'use strict';

var THREE = require('three');

var m3 = new THREE.Matrix3(),
	dCopy = new THREE.Vector3(),
	quat = new THREE.Quaternion();

const toRotationMatrix = function (q) {
	var fTx = q.x + q.x,
		fTy = q.y + q.y,
		fTz = q.z + q.z,
		fTwx = fTx * q.w,
		fTwy = fTy * q.w,
		fTwz = fTz * q.w,
		fTxx = fTx * q.x,
		fTxy = fTy * q.x,
		fTxz = fTz * q.x,
		fTyy = fTy * q.y,
		fTyz = fTz * q.y,
		fTzz = fTz * q.z;
	return m3.set(
		1.0 - (fTyy + fTzz), fTxy - fTwz, 0,
		fTxy + fTwz, 1.0 - (fTxx + fTzz), 0,
		fTxz - fTwy, fTyz + fTwx, 0);
};

module.exports = function (current, rotation, direction) {
	dCopy.copy(direction)
		.applyMatrix3(toRotationMatrix(quat.setFromEuler(rotation)));
	current.x += dCopy.x;
	current.y += dCopy.y;
};
