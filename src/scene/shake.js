const THREE = require('three');

let time = 0;
const MAX = 10;
const offset = new THREE.Vector2();
const ret = new THREE.Vector2(0, 0);

const m = 0.3;
var mag = () => Math.random() < 0.5 ? -m : m;

const update = () => {
	time -= 1;
	if (time >= 0) {
		offset.set(Math.random() * mag(), Math.random() * mag());
	} else {
		offset.set(0, 0);
	}
};

const start = () => {
	time = MAX;
};

const stop = () => {
	time = 0;
	offset.set(0, 0);
};

const get = p => {
	ret.set(p.x + offset.x, p.y + offset.y);
	return ret;
};

module.exports = {
  update,
  start,
  stop,
  get,
};
