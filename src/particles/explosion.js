'use strict';

var vert = `

float exponentialOut(float t) {
  return t == 1.0 ? t : 1.0 - pow(2.0, -10.0 * t);
}

attribute vec2 velocity;
attribute float time;
varying float vTime;
void main() {
	vTime = time;
	vec3 pos = vec3(position);
	pos.x = position.x + (exponentialOut(time) * 3.0 * velocity.x);
	pos.y = position.y + (exponentialOut(time) * 3.0 * velocity.y);
	vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
	gl_PointSize = (exponentialOut(time)) * 25.0;
	gl_Position = projectionMatrix * mvPosition;
}`;

var frag = `

float cubicOut(float t) {
  float f = t - 1.0;
  return f * f * f + 1.0;
}
varying float vTime;
void main() {
	gl_FragColor = vec4(0.169,0.367,0.91,cubicOut(1.0-vTime));
}`;

var _ = require('underscore'),
	THREE = require('three'),
	scene = require('../scene');

var TOTAL = 20;

var Particle = function () {
	var velocity = new THREE.Vector2(0, 0), time = 0, inc = 0.005 + (Math.random() * 0.05);

	this.init = function (angle) {
		// could move this to the shader
		velocity.x = Math.cos(angle) * Math.random() * 0.75;
		velocity.y = Math.sin(angle) * Math.random() * 0.75;
		time = 0;
	};

	this.getVelocity = function () {
		return velocity;
	};

	this.update = function () {
		time += inc;
	};

	this.getTime = function () {
		return time;
	};

};
// --end particle

module.exports = function () {
	var particleSystem,
		geometry,
		position = new THREE.Vector3(0, 0, 0),
		positions = new Float32Array(TOTAL * 3),
		velocities = new Float32Array(TOTAL * 2),
		times = new Float32Array(TOTAL), // each particle has one life
		particles = [],
		i, i2, i3, time, inc = 0.002;

	var shaderMaterial = new THREE.ShaderMaterial({
		uniforms: { },
		vertexShader: vert,
		fragmentShader: frag,

		blending: THREE.AdditiveBlending,
		depthTest: true,
		transparent: true

	});

	geometry = new THREE.BufferGeometry();

	for (i = 0, i2 = 0, i3 = 0; i < TOTAL; i++, i2 += 2, i3 += 3) {
		positions[i3 + 0] = 0;
		positions[i3 + 1] = 0;
		positions[i3 + 2] = 0;
		velocities[i2 + 0] = 0;
		velocities[i2 + 1] = 0;
		times[i] = 0;
		particles.push(new Particle());
	}

	geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
	geometry.addAttribute('velocity', new THREE.BufferAttribute(velocities, 2));
	geometry.addAttribute('time', new THREE.BufferAttribute(times, 1));

	particleSystem = new THREE.Points(geometry, shaderMaterial);

	this.particleSystem = particleSystem;

	this.stop = function () {
		position.set(0, 0, 0);
	};

	var tmp = 360 / TOTAL;
	this.start = function (pos) {
		time = 0;
		position.set(pos.x, pos.y, 0);
		_.each(particles, function (p, n) {
			p.init(n * tmp);
		});
		scene.boom();
	};

	this.clear = function () {
		time = 1;
		position.set(0, 0, 0);
	};

	this.update = function () {
		var i, i3, times = geometry.attributes.time.array,
			positions = geometry.attributes.position.array;

		time += inc;

		time = Math.min(1, time);

		if (time >= 1) this.clear();// TODO: don't clear this every time, clear once and stop rendering

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

};
