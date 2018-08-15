const THREE = require('three');

module.exports = () => {
	const  velocity = new THREE.Vector2(0, 0);
  const inc = 0.005 + (Math.random() * 0.05);
  let time = 0

	const init = angle => {
		// could move this to the shader
		velocity.x = Math.cos(angle) * Math.random() * 0.75;
		velocity.y = Math.sin(angle) * Math.random() * 0.75;
		time = 0;
	};

	const getVelocity = () => velocity;

	const update = () => {
		time += inc;
	};

	const getTime = () => time;

  return {
    init,
    getVelocity,
    update,
    getTime,
  };
};
