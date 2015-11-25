'use strict';

var _ = require('underscore'),
	THREE = require('three');

var Particle = function () {
	var position = new THREE.Vector3(0, 0, 0),
		velocity = new THREE.Vector2(0, 0.05),
		life = Math.random();

	var dir = function () {
		return Math.random() < 0.5 ? -1.0 : 1.0;
	};

	this.update = function (p, stopped) {
		life -= 0.008;
		// position.x += velocity.x;
		// position.y += velocity.y;
		if (life <= 0) {
			position.set(p.x, p.y, 10);
			velocity.x = 0;
			velocity.y = Math.random() * 0.06;
			position.x += Math.random() * 0.2 * dir();
			position.y += Math.random() * 0.2 * dir();
			life = Math.random();
			if (stopped) {
				position.z = -10.0;
			} else {
				position.z = 0.0;
			}
		}
	};

	this.hide = function () {
		// for some reason this needs to greater than the life reduction per iteration
		// but less than 2* the life reduction... fix it!
		life = 0.009;
	};

	this.getPosition = function () {
		return position;
	};

	this.getSize = function () {
		return life * 10;
	};
};
// --end particle

module.exports = function () {
	var particleSystem,
		geometry,
		stopped = true,
		num = 50,// number of particles
		positions = new Float32Array(num * 3),
		colors = new Float32Array(num * 3),
		sizes = new Float32Array(num),
		particles = [],
		position = new THREE.Vector2(), i, i3;

	var shaderMaterial = new THREE.ShaderMaterial({
		uniforms: { color: { type: 'c', value: new THREE.Color(0xffffff) } },
		vertexShader: document.getElementById('vertexshader').textContent,
		fragmentShader: document.getElementById('fragmentshader').textContent,

		blending: THREE.AdditiveBlending,
		depthTest: true,
		transparent: true

	});

	geometry = new THREE.BufferGeometry();

	for (i = 0, i3 = 0; i < num; i++, i3 += 3) {
		positions[i3 + 0] = 0;
		positions[i3 + 1] = 0;
		positions[i3 + 2] = 0;
		colors[i3 + 0] = 0.2;
		colors[i3 + 1] = 0.2;
		colors[i3 + 2] = 1;
		sizes[i] = 0;
		particles.push(new Particle());
	}

	geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
	geometry.addAttribute('customColor', new THREE.BufferAttribute(colors, 3));
	geometry.addAttribute('size', new THREE.BufferAttribute(sizes, 1));

	particleSystem = new THREE.Points(geometry, shaderMaterial);

	this.particleSystem = particleSystem;

	this.stop = function () {
		stopped = true;
	},

	this.start = function () {
		stopped = false;
	},

	this.clear = function () {
		stopped = true;
		_.each(particles, function (p) {
			p.hide();
		});
	},

	this.updatePosition = function (pos) {
		position.set(pos.x, pos.y);
		particleSystem.position.set(pos.x, pos.y, 0);
	};

	this.update = function () {
		var i, i3, sizes = geometry.attributes.size.array,
			positions = geometry.attributes.position.array;

		for (i = 0, i3 = 0; i < num; i++, i3 += 3) {
			particles[i].update(position, stopped);
			positions[i3 + 0] = particles[i].getPosition().x - position.x;
			positions[i3 + 1] = particles[i].getPosition().y - position.y;
			positions[i3 + 2] = particles[i].getPosition().z;
			sizes[i] = particles[i].getSize();
		}

		geometry.attributes.size.needsUpdate = true;
		geometry.attributes.position.needsUpdate = true;
	};

};
