const THREE = require('three');
const easing = require('bezier-easing');
const easeDown = easing(0.585, 0.000, 0.940, 0.805);
const easeUp = easing(0.105, 0.510, 0.560, 1.000);
const ret = new THREE.Vector2();
const pad = 6;
const dimensions = new THREE.Vector2();
const hard = new THREE.Vector2();
const minsoft = new THREE.Vector2();
const maxsoft = new THREE.Vector2();

const set = (width, height) => {
	dimensions.set(width, height);
	hard.set(14, 14);
	minsoft.set(hard.x + pad, hard.y + pad);
	maxsoft.set(dimensions.x - hard.x - pad, dimensions.y - hard.y - pad);
};

const get = v => {
	ret.set(v.x, v.y);
	if (ret.x < minsoft.x) {
		ret.x = hard.x + easeDown(ret.x / minsoft.x) * pad;
	}
	if (ret.x > maxsoft.x) {
		ret.x = maxsoft.x + (easeUp((ret.x - maxsoft.x) / minsoft.x)) * pad;
	}
	if (ret.y < minsoft.y) {
		ret.y = hard.y + easeDown(ret.y / minsoft.y) * pad;
	}
	if (ret.y > maxsoft.y) {
		ret.y = maxsoft.y + (easeUp((ret.y - maxsoft.y) / minsoft.y)) * pad;
	}
	return ret;
};

module.exports = {
  set,
  get,
};
