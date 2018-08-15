const THREE = require('three');
const createWorldPoints = require('./worldPoints');

module.exports = points => {
	const rotation = new THREE.Euler();
	const angularVelocity = new THREE.Vector3(0, 0, 0);
	const velocity = new THREE.Vector2(0, 0);
	const position = new THREE.Vector2(0, 0);
	const worldPoints = createWorldPoints(points);
  const tmpV2 = new THREE.Vector3(0, 0);
  const tmpV3 = new THREE.Vector3(0, 0, 0);
  const tmpEuler = new THREE.Euler();

	const update = (dt, applyForce, applyDamping) => {
    const force = tmpV2;
		const torque = tmpV3;
		force.set(0, 0);
		torque.set(0, 0, 0);
		applyForce(torque, force, rotation);
		force.multiplyScalar(dt);
		velocity.add(force);
		torque.multiplyScalar(dt);
		angularVelocity.add(torque);
		applyDamping(velocity, angularVelocity);
		force.copy(velocity).multiplyScalar(dt);
		torque.copy(angularVelocity).multiplyScalar(dt);
		position.add(force);
		rotation.z += torque.z;
		worldPoints.update(rotation, position);
	};

	const reset = function (x, y) {
		position.set(x, y);
		angularVelocity.set(0, 0, 0);
		velocity.set(0, 0);
		rotation.set(0, 0, 0);
	};

	const setRotation = function (z) {
		rotation.set(0, 0, z || 0);
	};

	const getPosition = () => tmpV3.set(position.x, position.y, 0);
	const getVelocity = () => tmpV3.set(velocity.x, velocity.y, 0);
	const getRotation = () => tmpEuler.copy(rotation);
	const getPoints = worldPoints.get;

	// with a line
	const handleCollision = function (collision) {
		position.add(collision.offset);
		velocity.sub(collision.normal.multiplyScalar(velocity.dot(collision.normal)));
	};

  return {
    update,
    reset,
    setRotation,
    position: getPosition,
    velocity: getVelocity,
    rotation: getRotation,
    getPoints,
    handleCollision,
  };
};
