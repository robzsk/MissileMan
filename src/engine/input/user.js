const events = require('minivents');
const gamepadInput = require('./gamepad');
const keyboardInput = require('./keyboard');
const { falsify, isMatch, assign } = require('./utils');

// allows for dual gamepad and keyboard configuration of the same player at the same time
module.exports = config => {
	// TODO: check for config.keys and config.buttons alignment(they need to have the same properties)
	let current = falsify(config.keys || config.buttons);
  let prev = assign({}, current);
  let moves = {};
  let gamepad;
  let keyboard;

  const api = {};

	const handleInput = function (m) {
		current = assign({}, m);
	};

	if (typeof config.gamepad === 'object') {
		gamepad = gamepadInput(config.gamepad.index, config.buttons);
		gamepad.on('input.move', handleInput);
	}
	if (typeof config.keys === 'object') {
		keyboard = keyboardInput(config.keys);
		keyboard.on('input.move', handleInput);
	}

	api.reset = () => {
		moves = {};
		api.off('input.move');
	};

	api.serialize = () => JSON.stringify(moves);

	api.update = tick => {
		if (gamepad) {
			gamepad.update(tick);
		}
		if (keyboard) {
			keyboard.update(tick);
		}

		if (!isMatch(current, prev)) {
			moves[tick.toString()] = assign({}, current);
			assign(prev, current); // copy
			api.emit('input.move', assign({}, current));
		}
	};

  events(api);
  return api;
};
