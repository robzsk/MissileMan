const events = require('minivents');
const gamepads = require('./gamepads');
const { falsify, isMatch, assign } = require('./utils');

module.exports = (index, buttons) => {
	let current = falsify(buttons);
	let prev = assign({}, current);
	const api = {};

	api.update = tick => {
		const pad = gamepads.get(index);
		if (pad) {
			buttons.forEach((button, action) => {
				current[action] = pad.buttons[button].pressed;
			});
		}
		if (!isMatch(current, prev)) {
			api.emit('input.move', assign({}, current));
			assign(prev, current); // copy
		}
	};

	events(api);
	return api;
};
