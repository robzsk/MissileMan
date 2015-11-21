'use strict';

var THREE = require('three');

var Particle = function () {
	var position = new THREE.Vector3(0, 0, 0);
	var velocity = new THREE.Vector2(0, 0.05);
	var life = Math.random();

	var d = function () {
		return Math.random() < 0.5 ? -1 : 1;
	};

	this.update = function (p, respawn) {
		life -= 0.08;
		position.x += velocity.x;
		position.y += velocity.y;
		if (life < 0) {
			if (respawn) {
				position.set(p.x, p.y, 0);
				velocity.x = 0;
				velocity.y = Math.random() * 0.06;
				position.x += Math.random() * 0.2 * d();
				position.y += Math.random() * 0.2 * d();
				position.z = 0;// back in view
				life = Math.random();
			} else {
				position.z = -100000;
			}
		}
	};

	this.getPosition = function () {
		return position;
	};

	this.getLife = function () {
		return life;
	};

	this.getSize = function () {
		return life * 10;
	};
};

module.exports = function () {
	var particleSystem, geometry;

	var stopped = true;

	var num = 50;

	var shaderMaterial = new THREE.ShaderMaterial({
		uniforms: { color: { type: 'c', value: new THREE.Color(0xffffff) } },
		vertexShader: document.getElementById('vertexshader').textContent,
		fragmentShader: document.getElementById('fragmentshader').textContent,

		blending: THREE.AdditiveBlending,
		depthTest: true,
		transparent: true

	});

	var positions = new Float32Array(num * 3);
	var colors = new Float32Array(num * 3);
	var sizes = new Float32Array(num);
	var particles = [];

	geometry = new THREE.BufferGeometry();

	for ( var i = 0, i3 = 0; i < num; i++, i3 += 3) {
		positions[ i3 + 0 ] = 0;
		positions[ i3 + 1 ] = 0;
		positions[ i3 + 2 ] = 0;

		colors[ i3 + 0 ] = 0.2;
		colors[ i3 + 1 ] = 0.2;
		colors[ i3 + 2 ] = 1;

		sizes[ i ] = 0;

		particles.push(new Particle());

	}

	geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
	geometry.addAttribute('customColor', new THREE.BufferAttribute(colors, 3));
	geometry.addAttribute('size', new THREE.BufferAttribute(sizes, 1));

	particleSystem = new THREE.Points(geometry, shaderMaterial);

	var position = new THREE.Vector2();

	this.particleSystem = particleSystem;

	this.stop = function () {
		stopped = true;
	},

	this.start = function () {
		stopped = false;
	},

	this.updatePosition = function (pos) {
		position.set(pos.x, pos.y);
		particleSystem.position.set(pos.x, pos.y, 0);
	};

	this.update = function () {
		var time = Date.now() * 0.005;
		// particleSystem.rotation.z = 0.01 * time;
		var sizes = geometry.attributes.size.array;
		var positions = geometry.attributes.position.array;

		for ( var i = 0, i3 = 0; i < num; i++, i3 += 3) {
			particles[i].update(position, !stopped);
			positions[i3 + 0] = particles[i].getPosition().x - position.x;
			positions[i3 + 1] = particles[i].getPosition().y - position.y;
			positions[i3 + 2] = particles[i].getPosition().z;
			sizes[i] = particles[i].getSize();
		}

		geometry.attributes.size.needsUpdate = true;
		geometry.attributes.position.needsUpdate = true;
	};

};
