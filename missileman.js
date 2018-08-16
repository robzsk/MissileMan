const log = require('electron').remote.getGlobal('console').log;

// this file is a work in progress and serves as a simple entry point for now
const application = () => {
	const replayData = require('./fixture/replay');
	const scene = require('./src/scene')(document.body);
	const assets = require('./src/assets');
	const world = require('./src/world')(scene);
	const levels = require('./src/levels');
	const createLoop = require('./src/engine').loop;
	const createInput = require('./src/engine').input;

	 // add fader before title
	const fader = require('./src/overlay/fader')(document.body);
	const title = require('./src/overlay/title')(document.body);

	const replay = createInput({ replay: replayData });
	const playerInput = createInput({
			keys: { left: 37, right: 39, morph: 67 },
			gamepad: { index: 0 }, buttons: { left: 14, right: 15, morph: 1 },
	});

	const start = () => {
	  const loop = createLoop();
	  loop.on('update', world.update);
	  loop.on('render', world.render);

		const load = (input = replay) => {
		  fader.fadeFromBlack();

			scene.clear();
			world.load(levels.load(0), assets, input);
			loop.reset();
		}

		world.on('player.lose', replay => {
			load(createInput({ replay }));
		});

		title.on('start', () => {
			title.hide();
			setTimeout(() => {
				load(playerInput);
			}, 1);

		})

		title.show();
		load();

	};

	assets.load().then(start);

};

document.addEventListener('DOMContentLoaded', application);
