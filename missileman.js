(function () {
	'use strict';

	const _ = require('underscore'),
		$ = require('jquery'),
		Title = require('./src/overlay/title'),
		World = require('./src/world'),
		Input = require('./src/engine/input'),
		assets = require('./src/assets'),
		levels = require('./src/levels'),
		loop = require('./src/engine/loop');

	var title = new Title(),
		world = new World(),
		spawnPoints, job;

	var input = new Input({
		keys: { left: 37, right: 39, jump: 38, morph: 67 },
		gamepad: { index: 0 }, buttons: { left: 14, right: 15, jump: 0, morph: 1}
	});

	var currentLevel = 0;

	var loadLevel = function (p) {
		loop.reset();
		world.loadLevel(levels.load(currentLevel), p);
	};

	var nextLevel = function (p) {
		loop.reset();
		currentLevel += 1;
		if (currentLevel >= levels.total()) {
			currentLevel = 0;
		}
		world.loadLevel(levels.load(currentLevel), p);
	};

	var showTitle = function () {
		loop.reset();
		loadLevel();
		title.fadeFromBlack();
		title.showTitle();
	};

	world.on('world.player.killed', function (player) {
		job = setTimeout(function () {
			if (world.isComplete()) {
				if (title.isVisible()) {
					loadLevel();
				} else {
					nextLevel(input);
				}
			} else {
				title.fadeFromBlack();
				loadLevel(title.isVisible() ? null: input);
			}
		}, 1000);
	});

	title.on('title.playbutton.click', function () {
		clearTimeout(job);
		title.hideTitle();
		title.fadeFromBlack();
		loadLevel(input);
		loop.reset();
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
