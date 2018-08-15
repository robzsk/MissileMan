const gamepads = require('./../input/gamepads'); // TODO: remove this coupling

const stats = require('./stats.js');
const events = require('minivents');

const timestamp = () =>
  window.performance && window.performance.now ?
    window.performance.now() : new Date().getTime();

const step = 1 / 60;
let paused = false;
let dt = 0;
let now;
let last = timestamp();
let ticks = 0;

const emptyStats = {
  begin: () => {},
  end: () => {},
};

const loop = () => ({
  reset: () => {
    reset: ticks = 0;
  },
});

module.exports = () => {
  const evLoop = loop();
  events(evLoop);

	const run = () => {
		gamepads.update(); // TODO: remove coupling
		requestAnimationFrame(run);
		stats.begin();
		now = timestamp();
		dt = now - last;
		last = now;
		evLoop.emit('update', ticks, step);
		evLoop.emit('render', dt);
		ticks += 1;
		stats.end();
	};
  run();

	return evLoop;
};
