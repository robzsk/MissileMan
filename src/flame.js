'use strict';

var vert = `
attribute float size;
void main() {
	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
	gl_PointSize = size;
	gl_Position = projectionMatrix * mvPosition;
}`;

var frag = `
uniform sampler2D transitions;
void main() {
	gl_FragColor = texture2D(transitions, vec2(0, 0.001));
}`;

var $ = require('jquery'),
	_ = require('underscore'),
	THREE = require('three'),
	scene = require('./scene');

var Particle = function () {
	var position = new THREE.Vector3(0, 0, 0),
		life = 0;

	var dir = function () {
		return Math.random() < 0.5 ? -1.0 : 1.0;
	};

	this.update = function (p) {
		life -= 0.008;
		if (life <= 0) {
			position.x = p.x + Math.random() * 0.2 * dir();
			position.y = p.y + Math.random() * 0.2 * dir();
			life = Math.random();
			if (this.respawn) {
				position.z = 0;
			} else {
				position.z = -10;
			}
		}
	};

	this.respawn = false;

	this.hide = function () {
		// for some reason this needs to be greater than the life reduction per iteration
		// but less than 2* the life reduction... fix it!
		life = 0.009;

		this.respawn = false;
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
		num = 50,// number of particles
		positions = new Float32Array(num * 3),
		sizes = new Float32Array(num),
		particles = [],
		position = new THREE.Vector2(), i, i3;

	var shaderMaterial = new THREE.ShaderMaterial({
		uniforms: {
			transitions: { type: 't', value: THREE.ImageUtils.loadTexture('assets/textures/transitions.png') }
		},
		vertexShader: vert,
		fragmentShader: frag,

		blending: THREE.AdditiveBlending,
		depthTest: true,
		transparent: true

	});

	geometry = new THREE.BufferGeometry();

	for (i = 0, i3 = 0; i < num; i++, i3 += 3) {
		positions[i3 + 0] = 0;
		positions[i3 + 1] = 0;
		positions[i3 + 2] = 0;
		sizes[i] = 0;
		particles.push(new Particle());
	}

	geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
	geometry.addAttribute('size', new THREE.BufferAttribute(sizes, 1));

	particleSystem = new THREE.Points(geometry, shaderMaterial);

	this.particleSystem = particleSystem;

	this.stop = function () {
		_.each(particles, function (p) {
			p.respawn = false;
		});
	},

	this.start = function () {
		_.each(particles, function (p) {
			p.respawn = true;
		});
	},

	this.clear = function () {
		_.each(particles, function (p) {
			p.hide();
		});
	},

	this.updatePosition = function (pos) {
		position.set(pos.x, pos.y);// where to spawn new particles from(this is the missiles tail pipe)
		particleSystem.position.set(scene.getCameraPosition().x, scene.getCameraPosition().y, 0);
	};

	this.update = function () {
		var i, i3, sizes = geometry.attributes.size.array,
			positions = geometry.attributes.position.array;
		for (i = 0, i3 = 0; i < num; i++, i3 += 3) {
			particles[i].update(position);
			positions[i3 + 0] = particles[i].getPosition().x - scene.getCameraPosition().x;
			positions[i3 + 1] = particles[i].getPosition().y - scene.getCameraPosition().y;
			positions[i3 + 2] = particles[i].getPosition().z;
			sizes[i] = particles[i].getSize();
		}

		geometry.attributes.size.needsUpdate = true;
		geometry.attributes.position.needsUpdate = true;
	};

};
