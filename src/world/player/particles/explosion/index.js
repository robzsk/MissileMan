
const vert = require('./shaders/vert');
const createFrag = require('./shaders/frag');
const createParticle = require('./particle');
const THREE = require('three');

const TOTAL = 20;

module.exports = (color, scene) => {
	let particleSystem;
	const geometry = new THREE.BufferGeometry();
	const position = new THREE.Vector3(0, 0, 0);
	const positions = new Float32Array(TOTAL * 3);
	const velocities = new Float32Array(TOTAL * 2);
	const times = new Float32Array(TOTAL); // each particle has one life
	const particles = [];
	let i;
	let i2;
	let i3;
	let time;
	const inc = 0.004;

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

	const stop = () => {
		position.set(0, 0, 0);
	};

	const tmp = 360 / TOTAL; // precalc
	const start = pos => {
		time = 0;
		position.set(pos.x, pos.y, 1);
		particles.forEach((p, n) => {
			p.init(n * tmp);
		});
		scene.boom();
	};

	const clear = () => {
		time = 1;
		position.set(0, 0, 0);
	};

	const update = () => {
		let i;
		let i3;
		const times = geometry.attributes.time.array;
		const positions = geometry.attributes.position.array;

		time += inc;
		time = Math.min(1, time);

		if (time >= 1) clear();// TODO: don't clear this every time, clear once and stop rendering

		particleSystem.position.set(scene.getCameraPosition().x, scene.getCameraPosition().y, 0);

		for (i = 0, i2 = 0, i3 = 0; i < TOTAL; i++, i2 += 2, i3 += 3) {
			particles[i].update();
			positions[i3 + 0] = position.x - scene.getCameraPosition().x;
			positions[i3 + 1] = position.y - scene.getCameraPosition().y;
			positions[i3 + 2] = position.z;
			velocities[i2 + 0] = particles[i].getVelocity().x;
			velocities[i2 + 1] = particles[i].getVelocity().y;
			times[i] = particles[i].getTime();
		}

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
