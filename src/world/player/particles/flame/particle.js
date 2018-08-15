const THREE = require('three');

module.exports = () => {
	const position = new THREE.Vector3(0, 0, 0);
  const velocity = new THREE.Vector2(0, 0);
	let time = 0;
  let inc;

	const dir = () => Math.random() < 0.5 ? -1.0 : 1.0;

	const setInc = () => {
		inc = 0.01 + (Math.random() * 0.05);
	};

	setInc();

	const update = (p, a) => {
		time += inc;
		if (time >= 1) {
			setInc();
			velocity.x = Math.cos(a - 1.5708);// could move these to the shader...
			velocity.y = Math.sin(a - 1.5708);// + 90 degrees in radians
			position.x = p.x + Math.random() * 0.1 * dir();
			position.y = p.y + Math.random() * 0.1 * dir();
			time = 0.0;
			if (respawn) {
				position.z = 0;
			} else {
				position.z = -10;
			}
		}
	};

	let respawn = false;
	const start = () => {
		respawn = true;
		time = 1;
	};
	const stop = () => {
		respawn = false;
	};

	const clear = () => {
		time = 1;
		respawn = false;
	};

	const getPosition = () => position;

	const getVelocity = () => velocity;

	const getTime = () => time;

  return {
    update,
    start,
    stop,
    clear,
    getPosition,
    getVelocity,
    getTime,
  };
};
