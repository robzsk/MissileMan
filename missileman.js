(function () {
	'use strict';

	const _ = require('underscore'),
		$ = require('jquery'),
		Title = require('./src/overlay/title'),
		World = require('./src/world'),
		assets = require('./src/assets'),
		loop = require('./src/engine/loop'),
		replays = require('./src/replays');

	var title = new Title(),
		world = new World(),
		spawnPoints;

	var loadLevel = function () {
		var level = assets.level.test();
		world.clear();
		replays.init(level.spawnPoints);
		world.addBlocks(level.cells);
	};

	var setupPlayers = function () {
		_.each(replays.getPlayers(), function (p, n) {
			world.addPlayer(p, n === replays.getCurrentPlayer());
		});
	};

	var startLevel = function () {
		loop.reset();
		replays.reset();
		setupPlayers();
	};

	var showTitle = function () {
		loop.reset();
		replays.reload();
		replays.setDemoMode(true);
		loadLevel();
		setupPlayers();
		title.fadeFromBlack();
		title.showTitle();
	};

	world.on('world.player.killed', function (player) {
		if (world.isComplete()) {
			replays.save();
		}

		// TODO: should be doing this in setTimeout?
		replays.next();

		setTimeout(function () {
			if (world.isComplete()) {
				showTitle();
			} else {
				title.fadeFromBlack();
				loop.reset();
				loadLevel();
				setupPlayers();
			}
		}, 1000);
	});

	title.on('title.playbutton.click', function () {
		replays.setDemoMode(false);
		title.hideTitle();
		title.fadeFromBlack();
		loadLevel();
		startLevel();
	});

	$(document).ready(function () {
		assets.load(showTitle);
	});

	loop.on('loop.update', function (ticks, step) {
		title.update(ticks);
		world.update(ticks, step);
	});

	loop.on('loop.render', function (dt) {
		world.render(dt);
	});
})();
