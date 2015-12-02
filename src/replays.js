'use strict';

var _ = require('underscore'),
	Input = require('./engine/input'),
	Player = require('./player'),
	storage = require('./storage');

module.exports = function () {
	var playerInput = new Input({
			keys: { left: 37, right: 39, jump: 38, morph: 67 },
			gamepad: { index: 0 }, buttons: { left: 14, right: 15, jump: 0, morph: 1}
		}),
		replays = [],
		currentPlayer = 0,
		spawnPoints,
		playerInput,
		demo = true;

	var createCurrentPlayer = function () {
		replays.push({
			spawn: spawnPoints[currentPlayer],
			input: playerInput
		});
	};

	var incCurrentPlayer = function () {
		currentPlayer += 1;
		if (currentPlayer >= spawnPoints.length) {
			currentPlayer = 0;
		}
	};

	return {
		init: function (sp) {
			spawnPoints = sp;
		},

		reset: function () {
			replays = [];
			currentPlayer = 0;
		},

		reload: function () {
			replays = storage.replays();
			currentPlayer = 0;
		},

		getCurrentPlayer: function () {
			return currentPlayer;
		},

		save: function () {
			if (!demo) {
				storage.replays(replays);
			}
		},

		// TODO: use a object pool here
		next: function () {
			if (!demo) {
				replays[currentPlayer].input = new Input({replay: playerInput.serialize()});
				playerInput.reset();
			}
			incCurrentPlayer();
			if (!replays[currentPlayer]) {
				createCurrentPlayer();
			} else {
				if (!demo) {
					replays[currentPlayer].input = playerInput;
				}
			}
		},

		setDemoMode: function (d) {
			demo = d;
		},

		getPlayers: function () {
			var player, ret, pool = [];
			return function () {
				ret = [];
				// must have at least one replay
				if (replays.length === 0) {
					createCurrentPlayer();
				}
				_.each(replays, function (r) {
					if (pool.length <= ret.length) {
						player = new Player();
						pool.push(player);
					} else {
						player = pool[ret.length];
					}
					player.set(r);
					ret.push(player);
				});
				return ret;
			};
		}()
	};

}();
