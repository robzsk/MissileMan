const THREE = require('three');
const models = require('./data/models.js');
const configs = require('./data/configs');

const mesh = {};

const load = () => new Promise((resolve) => {
	const loader = new THREE.JSONLoader();
	let loaded = configs.length;
	const loadMesh = conf => {
		const object = loader.parse(models[conf.file || conf.name]);
		const material = object.materials || new THREE.MeshBasicMaterial({ color: conf.color });
		if (material.length >= 1) {
			mesh[conf.name] = new THREE.Mesh(object.geometry, material);
		} else {
			mesh[conf.name] = new THREE.Mesh(object.geometry, material);
		}
		loaded -= 1;
		if (loaded <= 0) {
			resolve();
		}
	};
	configs.forEach(c => {
		loadMesh(c);
	});
});

const cubeEmpty = n => mesh.empty.clone();

const wall = () =>
	mesh.wall.clone();

const target = (() => {
	const clone = {};
	let cl;
	return () => {
		const color = new THREE.Color('rgb(55, 116, 196)');
		const m = wall();
		const hex = color.getHexString();
		if (!clone[hex]) {
			cl = new THREE.Mesh(m.geometry.clone(), m.material.clone());
			cl.material.color.setRGB(color.r, color.g, color.b);
			clone[hex] = cl;
		}
		return clone[hex].clone();
	};
})();

const switchMan = (() => {
	const clone = {};
	let cl;
	return () => {
		const color = new THREE.Color('rgb(186, 87, 70)');
		const m = wall();
		const hex = color.getHexString();
		if (!clone[hex]) {
			cl = new THREE.Mesh(m.geometry.clone(), m.material.clone());
			cl.material.color.setRGB(color.r, color.g, color.b);
			clone[hex] = cl;
		}
		return clone[hex].clone();
	};
})();

const missileOnly = (() => {
	const clone = {};
	let cl;
	return () => {
		const color = new THREE.Color('rgb(99, 161, 93)');
		const m = wall();
		const hex = color.getHexString();
		if (!clone[hex]) {
			cl = new THREE.Mesh(m.geometry.clone(), m.material.clone());
			cl.material.color.setRGB(color.r, color.g, color.b);
			clone[hex] = cl;
		}
		return clone[hex].clone();
	};
	})();

const man = (() => {
	const clone = {};
	let cl;
	const create = color => {
		const m = mesh.man;
		const hex = color.getHexString();
		if (!clone[hex]) {
			cl = new THREE.Mesh(m.geometry.clone(), m.material);
			cl.material[1].color.setRGB(color.r, color.g, color.b);
			clone[hex] = cl;
		}
		return clone[hex].clone();
	};
	return create;
})();

const missile = (() => {
	const clone = {};
	let cl;
	const create = color => {
		const m = mesh.man;
		const hex = color.getHexString();
		if (!clone[hex]) {
			cl = new THREE.Mesh(m.geometry.clone(), m.material);
			cl.rotation.set(0, 0, Math.PI);
			cl.updateMatrix();
			cl.geometry.applyMatrix(cl.matrix);
			cl.material[1].color.setRGB(color.r, color.g, color.b);
			clone[hex] = cl;
		}
		return clone[hex].clone();
	};
	return create;
})();

module.exports = {
	load,
	model: {
		wall,
		target,
		missileOnly,
		man,
		missile,
		switchMan,
	},
}
