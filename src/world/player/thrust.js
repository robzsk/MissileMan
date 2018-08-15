const THREE = require('three');

const m3 = new THREE.Matrix3();
const dCopy = new THREE.Vector3();
const quat = new THREE.Quaternion();

const toRotationMatrix = q => {
	const fTx = q.x + q.x;
	const fTy = q.y + q.y;
	const fTz = q.z + q.z;
	const fTwx = fTx * q.w;
	const fTwy = fTy * q.w;
	const fTwz = fTz * q.w;
	const fTxx = fTx * q.x;
	const fTxy = fTy * q.x;
	const fTxz = fTz * q.x;
	const fTyy = fTy * q.y;
	const fTyz = fTz * q.y;
	const fTzz = fTz * q.z;
	return m3.set(
		1.0 - (fTyy + fTzz), fTxy - fTwz, 0,
		fTxy + fTwz, 1.0 - (fTxx + fTzz), 0,
		fTxz - fTwy, fTyz + fTwx, 0);
};

module.exports = (current, rotation, direction) => {
	dCopy.copy(direction)
		.applyMatrix3(toRotationMatrix(quat.setFromEuler(rotation)));
	current.x += dCopy.x;
	current.y += dCopy.y;
};
