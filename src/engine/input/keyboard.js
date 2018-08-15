const events = require('minivents');
const { falsify, isMatch, assign } = require('./utils');

module.exports = keys => {
	let current = falsify(keys);
	let prev = assign({}, current)

  const api = {};

	const onkey = (ev, kc, down) => {
		Object.keys(keys).forEach(k => {
      const v = keys[k];
			if (v === kc) {
				current[k] = down;
				ev.preventDefault();
				return true;
			}
		});
	};

	document.body.addEventListener('keydown', ev => onkey(ev, ev.keyCode, true));
	document.body.addEventListener('keyup', ev => onkey(ev, ev.keyCode, false));

	api.update = tick => {
		if (!isMatch(current, prev)) {
			api.emit('input.move', assign({}, current));
			assign(prev, current); // copy
		}
	};

  events(api);

  return api;
};
