const easing = require('bezier-easing');

module.exports = (changeToMan, changeToMissile) => {
	const ttl = 7;

	const easeDown = easing(0, 0, 1, 1);
	const easeUp = easing(0.25, 0.25, 0.5, 3.5);
	let n = 0;
	let scale = 1;
	let down = false;
	let up = false;
	let isMan = true;

	const doMorph = () => {
		if (isMan) {
			isMan = false;
			changeToMissile();
		} else {
			isMan = true;
			changeToMan();
		}
	};

	const canMorph = () => !down && !up;

	const reset = () => {
		scale = 1;
		n = 0;
		isMan = true;
		up = down = false;
	};

	const getIsMan = () => isMan;

	const getScale = () => scale || 0.00001;

	const go = () => {
		if (canMorph()) {
			down = true;
		}
	};

	const update = () => {
		if (down) {
			scale = easeDown(n / ttl);
			n -= 1;
			if (n < 0) {
				down = false;
				up = true;
				n = 0;
				doMorph();
			}
		}
		if (up) {
			scale = easeUp(n / ttl);
			n += 1;
			if (n > ttl) {
				up = false;
				n = ttl;
			}
		}
	};

	return {
		reset,
		isMan: getIsMan,
		getScale,
		go,
		update,
	};
};
