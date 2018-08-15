// this file is a work in progress and serves as a simple entry point for now
const application = () => {
	const replayData = require('./fixture/replay');
	const scene = require('./src/scene')(document.body);
	const assets = require('./src/assets');
	const world = require('./src/world')(scene);
	const levels = require('./src/levels');
	const createLoop = require('./src/engine').loop;
	const createInput = require('./src/engine').input;

	const replay = createInput({ replay: replayData });
	const playerInput = createInput({
			keys: { left: 37, right: 39, morph: 67 },
			gamepad: { index: 0 }, buttons: { left: 14, right: 15, morph: 1 },
	});

	const start = () => {
	  const loop = createLoop();
	  loop.on('update', world.update);
	  loop.on('render', world.render);

		const load = () => {
			// TODO: setup the level with the player input/replays before load
			// world.load(levels.load(0), assets, playerInput);

			scene.clear();
			world.load(levels.load(0), assets, replay);
			loop.reset();
		}

		world.on('player.win', replay => {
			// console.log(replay);
			setTimeout(load, 1000);
		});

		load();

	};

	assets.load().then(start);
};

document.addEventListener('DOMContentLoaded', application);
