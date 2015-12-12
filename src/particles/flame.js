'use strict';

var vert = `
float quarticOut(float t) {
  return pow(t - 1.0, 3.0) * (1.0 - t) + 1.0;
}
float exponentialOut(float t) {
  return t == 1.0 ? t : 1.0 - pow(2.0, -10.0 * t);
}

attribute vec2 velocity;
attribute float time;
varying float vTime;
void main() {
	vTime = time;
	vec3 pos = vec3(position);
	pos.x = position.x + (exponentialOut(time) * velocity.x);
	pos.y = position.y + (exponentialOut(time) * velocity.y);
	vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
	gl_PointSize = 7.0;
	gl_Position = projectionMatrix * mvPosition;
}`;

var frag = function (r, g, b) {
	return `

float cubicOut(float t) {
  float f = t - 1.0;
  return f * f * f + 1.0;
}
varying float vTime;
void main() {
	gl_FragColor = vec4(${r},${g},${b},cubicOut(1.0-vTime));
}`;
};

var _ = require('underscore'),
	THREE = require('three'),
	scene = require('../scene');

var TOTAL = 75;

var Particle = function () {
	var position = new THREE.Vector3(0, 0, 0), velocity = new THREE.Vector2(0, 0),
		time = 0, inc;

	var dir = function () {
		return Math.random() < 0.5 ? -1.0 : 1.0;
	};

	var setInc = function () {
		inc = 0.01 + (Math.random() * 0.05);
	};

	setInc();

	this.update = function (p, a) {
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

	var respawn = false;
	this.start = function () {
		respawn = true;
		time = 1;
	};
	this.stop = function () {
		respawn = false;
	};

	this.clear = function () {
		time = 1;
		respawn = false;
	};

	this.getPosition = function () {
		return position;
	};

	this.getVelocity = function () {
		return velocity;
	};

	this.getTime = function () {
		return time;
	};
};
// --end particle

module.exports = function (color) {
	var particleSystem,
		geometry,
		positions = new Float32Array(TOTAL * 3),
		velocities = new Float32Array(TOTAL * 2),
		times = new Float32Array(TOTAL), // each particle has one life
		particles = [],
		i, i2, i3;

	var shaderMaterial = new THREE.ShaderMaterial({
		uniforms: { },
		vertexShader: vert,
		fragmentShader: frag(color.r, color.g, color.b),

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
	particleSystem.frustumCulled = false;

	this.particleSystem = particleSystem;

	// TODO: look into this, the ps seems to get incorrectly culled if it's not drawn on screen at least once
	particleSystem.frustumCulled = false;

	this.stop = function () {
		_.each(particles, function (p) {
			p.stop();
		});
	},

	this.start = function () {
		_.each(particles, function (p) {
			p.start();
		});
	},

	this.clear = function () {
		_.each(particles, function (p) {
			p.clear();
		});
	},

	this.update = function (pos, angle) {
		var i, i3, times = geometry.attributes.time.array,
			positions = geometry.attributes.position.array;

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

};
