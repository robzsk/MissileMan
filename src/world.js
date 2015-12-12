'use strict';

var _ = require('underscore'),
	util = require('util'),
	EventEmitter = require('events').EventEmitter;

var World = function () {
	const assets = require('./assets'),
		scene = require('./scene'),
		storage = require('./storage'),
		Player = require('./player'),
		Input = require('./engine/input'),
		Map = require('./engine/map'),
		Line = require('./engine/line');

	var self = this,
		map = new Map(),
		players = [],
		targets = [],
		level,
		playerToWatch;

	EventEmitter.call(this);

	var save = function () {
		var save = [];
		_.each(players, function (player) {
			save.unshift({ r: player.getSerializedInput() });
		});
		storage.level(level.id, save);
	};

	var handleCollision = function () {
		var killPlayer = function (player) {
			scene.remove(player.avatar.man);
			scene.remove(player.avatar.missile);
			if (!player.isDead()) {
				player.kill();
				if (player === players[0]) {
					save();
				}
				if (player === playerToWatch) {
					self.emit('world.player.killed');
				}
			}
		};
		return function (player, collision, type) {
			if (type === 1) {
				killPlayer(player);
			} else if (type === 2) {
				_.every(targets, function (t) {
					if (t.position.x === collision.x && t.position.y === collision.y) {
						scene.remove(t);
						map.removeBlock(collision.x, collision.y);
						targets = _.without(targets, t);
						return false;
					}
					return true;
				});
				killPlayer(player);
			}
		};
	}();

	var removeLastPlayer = function () {
		var player = players.pop();
		scene.remove(player.avatar.man);
		scene.remove(player.avatar.missile);
		scene.remove(player.getFlame());
		scene.remove(player.getExplosion());
	};
	var addPlayer = function (player, color) {
		players.unshift(player);
		if (!player.avatar) {
			player.avatar = {};
		}
		player.avatar.man = assets.model.man(color);
		player.avatar.missile = assets.model.missile(color);
		scene.add(player.avatar.man);
		scene.add(player.avatar.missile);
		scene.add(player.getFlame());
		scene.add(player.getExplosion());
		if (players.length > level.max) {
			removeLastPlayer();
		}
	};

	var clear = function () {
		playerToWatch = undefined;
		players = [];
		targets = [];
		map.clear();
		scene.clear();
	};

	var loadBlocks = function () {
		var blocks = level.cells;
		map.addBlocks(blocks);

		_.each(blocks, function (row, y) {
			_.each(row, function (cell, x) {
				var cube;
				if (cell === 1) {
					cube = assets.model.cubeSolid();
				} else if (cell === 2) {
					cube = assets.model.cubeTarget();
					targets.push(cube);
				}
				if (cube) {
					cube.position.set(x, y, 0);
					scene.add(cube);
				}
			});
		});

	};

	this.update = function (ticks, step) {
		_.each(players, function (p) {
			p.update(ticks, step);
			if (p.isMan()) {
				map.handleCollides(p, 1);
			} else {
				map.checkCollides(p, 1, handleCollision);
			}
			map.checkCollides(p, 2, handleCollision);
		});
	};

	this.render = function (dt) {
		_.each(players, function (p) {
			p.avatar.missile.visible = p.avatar.man.visible = false;
			if (p.isMan()) {
				p.avatar.man.visible = true;
				p.avatar.man.position.set(p.position().x, p.position().y, 0.5);// TODO: set the z position elsewhere
				p.avatar.man.scale.set(p.getScale(), p.getScale(), p.getScale());
			} else {
				p.avatar.missile.visible = true;
				p.avatar.missile.rotation.set(0, 0, p.rotation().z, 'ZYX');
				p.avatar.missile.position.set(p.position().x, p.position().y, 0.5);// TODO: set the z position elsewhere
				p.avatar.missile.scale.set(p.getScale(), p.getScale(), p.getScale());
			}
		});

		if (playerToWatch) {
			scene.follow(playerToWatch.position());
		}
		scene.render();
	};

	this.isComplete = function () {
		return targets.length === 0;
	};

	// where mode is blue, red or green
	// demo is whether to load a playable player
	this.loadLevel = function (levelToLoad, input, mode) {
		var color = {r: 0.169, g: 0.367, b: 0.91};// TODO: define elsewhere

		var player,
			stored = storage.level(levelToLoad.id) || [];

		clear();
		level = levelToLoad;
		loadBlocks();

		_.each(stored, function (replay) {
			player = new Player(color);
			player.setInput(new Input({replay: replay.r}));
			player.setSpawn(level.spawn);
			player.revive();
			addPlayer(player, color);
		});

		if (input) {
			player = new Player(color);
			player.setInput(input);
			player.setSpawn(level.spawn);
			player.revive();
			addPlayer(player, color);
			playerToWatch = player;
		} else {
			playerToWatch = players[Math.floor(Math.random() * players.length)];
		}
	};

};

util.inherits(World, EventEmitter);

module.exports = World;
