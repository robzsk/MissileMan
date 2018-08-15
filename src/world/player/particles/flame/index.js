const vert = require('./shaders/vert');
const createFrag = require('./shaders/frag');
const createParticle = require('./particle');
const THREE = require('three');

const TOTAL = 75;

module.exports = (color, scene) => {
	let particleSystem;
	const geometry = new THREE.BufferGeometry();
	const positions = new Float32Array(TOTAL * 3);
	const velocities = new Float32Array(TOTAL * 2);
	const times = new Float32Array(TOTAL); // each particle has one life
	const particles = [];
	let i;
  let i2;
  let i3;

	const shaderMaterial = new THREE.ShaderMaterial({
		uniforms: { },
		vertexShader: vert,
		fragmentShader: createFrag(color.r, color.g, color.b),

		blending: THREE.AdditiveBlending,
		depthTest: true,
		transparent: true

	});

	for (i = 0, i2 = 0, i3 = 0; i < TOTAL; i++, i2 += 2, i3 += 3) {
		positions[i3 + 0] = 0;
		positions[i3 + 1] = 0;
		positions[i3 + 2] = 0;
		velocities[i2 + 0] = 0;
		velocities[i2 + 1] = 0;
		times[i] = 0;
		particles.push(createParticle());
	}

	geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
	geometry.addAttribute('velocity', new THREE.BufferAttribute(velocities, 2));
	geometry.addAttribute('time', new THREE.BufferAttribute(times, 1));

	particleSystem = new THREE.Points(geometry, shaderMaterial);
	particleSystem.frustumCulled = false;

	// TODO: look into this, the ps seems to get incorrectly culled if it's not drawn on screen at least once
	particleSystem.frustumCulled = false;

	const stop = () => {
		particles.forEach(p => {
			p.stop();
		});
	};

	const start = () => {
		particles.forEach(p => {
			p.start();
		});
	};

	const clear = () => {
		particles.forEach(p => {
			p.clear();
		});
	};

	const update = (pos, angle) => {
		let i;
    let i3;
    const times = geometry.attributes.time.array;
		const positions = geometry.attributes.position.array;

		particleSystem.position.set(scene.getCameraPosition().x, scene.getCameraPosition().y, 0);

		for (i = 0, i2 = 0, i3 = 0; i < TOTAL; i++, i2 += 2, i3 += 3) {
			particles[i].update(pos, angle);
			positions[i3 + 0] = particles[i].getPosition().x - scene.getCameraPosition().x;
			positions[i3 + 1] = particles[i].getPosition().y - scene.getCameraPosition().y;
			positions[i3 + 2] = particles[i].getPosition().z;
			velocities[i2 + 0] = particles[i].getVelocity().x;
			velocities[i2 + 1] = particles[i].getVelocity().y;
			times[i] = particles[i].getTime();
		}

		// TODO: try not updating these when we're trying to turn the effect off
		geometry.attributes.time.needsUpdate = true;
		geometry.attributes.position.needsUpdate = true;
		geometry.attributes.velocity.needsUpdate = true;
	};

  return {
    stop,
    start,
    clear,
    update,
    particleSystem,
  };
};
