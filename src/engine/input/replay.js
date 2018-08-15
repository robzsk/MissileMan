const events = require('minivents');

const isString = str => typeof str === 'string';
module.exports = file => {
  const api = {};
  const moves = file ?
		(isString(file) ? JSON.parse(file) : file) : [];

  api.update = tick => {
		var m = moves[tick.toString()];
		if (m) {
			api.emit('input.move', Object.assign({}, m));
		}
	};
  api.serialize = () => JSON.stringify(moves);
  api.reset = () => {};

  events(api);
  return api;
};
