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

	var MASK = {
		empty: 0,
		wall: 1,
		target: 2
	};

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
			if (type === MASK.wall) {
				killPlayer(player);
			} else if (type === MASK.target) {
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
				if (cell === MASK.wall) {
					cube = assets.model.cubeSolid();
				}
				if (cube) {
					cube.position.set(x, y, 0);
					scene.add(cube);
				}
			});
		});

	};

	var addTarget = function (v, color) {
		var target = assets.model.cubeTarget();
		targets.push(target);
		target.position.set(v.x, v.y, 0);
		scene.add(target);
		map.setBlock(v.x, v.y, MASK.target);
	};

	this.update = function (ticks, step) {
		_.each(players, function (p) {
			p.update(ticks, step);
			if (p.isMan()) {
				map.handleCollides(p, MASK.wall);
			} else {
				map.checkCollides(p, MASK.wall, handleCollision);
			}
			map.checkCollides(p, MASK.target, handleCollision);
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

	var THREE = require('three');
	var colorSelector = {
		red: new THREE.Color('rgb(186, 87, 70)'),
		green: new THREE.Color('rgb(99, 161, 93)'),
		blue: new THREE.Color('rgb(55, 116, 196)')
	};

	// where mode is blue, red or green
	// demo is whether to load a playable player
	this.loadLevel = function (levelToLoad, input, colorMode) {
		var color = colorSelector[colorMode];

		var player, spawn,
			stored = storage.level(levelToLoad.id) || [];

		clear();
		level = levelToLoad;
		loadBlocks();

		_.each(level.target, function (v, k) {
			addTarget(v, k);
		});

		spawn = JSON.parse(JSON.stringify(level.spawn.red));
		spawn.x += 0.5;
		spawn.y += 0.5;

		_.each(stored, function (replay) {
			// todo: remove this
			color = colorSelector[colorMode];

			player = new Player(color);
			player.setInput(new Input({replay: replay.r}));
			player.setSpawn(spawn);
			player.revive();
			addPlayer(player, color);
		});

		if (input) {
			player = new Player(color);
			player.setInput(input);
			player.setSpawn(spawn);
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
