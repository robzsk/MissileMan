'use strict';

var _ = require('underscore'),
	util = require('util'),
	EventEmitter = require('events').EventEmitter,
	THREE = require('three');

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
		players,
		targets,
		level,
		playerToWatch;

	var MASK = {
		empty: 0,
		wall: 1,
		target: 2
	};

	EventEmitter.call(this);

	var saveReplays = function () {
		var save = { };
		_.each(players, function (list, color) {
			save[color] = save[color] || [];
			_.each(list, function (player) {
				save[color].unshift({ r: player.getSerializedInput() });
			});
		});
		storage.level(level.id, save);
	};

	var killPlayer = function (player) {
		scene.remove(player.avatar.man);
		scene.remove(player.avatar.missile);
		if (!player.isDead()) {
			player.kill();
			if (player === playerToWatch) {
				saveReplays();
				self.emit('world.player.killed');
			}
		}
	};

	var handleCollision = function (player, collision, type) {
		var playerColor = player.getColor().getHexString();
		if (type === MASK.wall) {
			killPlayer(player);
		} else if (type === MASK.target) {
			_.each(targets, function (list, color) {
				if (playerColor === color) {
					_.every(list, function (t, k) {
						if (t.position.x === collision.x && t.position.y === collision.y) {
							scene.remove(t);
							map.removeBlock(collision.x, collision.y);
							targets[color] = _.without(targets[color], t);
							return false;
						}
						return true;
					});
				}
			});
			killPlayer(player);
		}
	};

	var removeLastPlayer = function (color) {
		var player = players[color].pop();
		scene.remove(player.avatar.man);
		scene.remove(player.avatar.missile);
		scene.remove(player.getFlame());
		scene.remove(player.getExplosion());
	};

	var addPlayer = function (player, color) {
		var hex = color.getHexString();
		players[hex] = players[hex] || [];
		players[hex].unshift(player);
		if (!player.avatar) {
			player.avatar = {};
		}
		player.avatar.man = assets.model.man(color);
		player.avatar.missile = assets.model.missile(color);
		scene.add(player.avatar.man);
		scene.add(player.avatar.missile);
		scene.add(player.getFlame());
		scene.add(player.getExplosion());
		if (players[hex].length > level.max) {
			removeLastPlayer(hex);
		}
	};

	var clear = function () {
		playerToWatch = undefined;
		players = { };
		targets = { };
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

	var addTarget = function (v, hex) {
		var color = new THREE.Color(parseInt(hex, 16)),
			target = assets.model.cubeTarget(color);
		targets[hex] = targets[hex] || [];
		targets[hex].push(target);
		target.position.set(v.x, v.y, 0);
		scene.add(target);
		map.setBlock(v.x, v.y, MASK.target);
	};

	this.update = function (ticks, step) {
		_.each(players, function (list, color) {
			_.each(list, function (p) {
				p.update(ticks, step);
				if (!p.isDead()) {
					// collide with map
					if (p.isMan()) {
						map.handleCollides(p, MASK.wall);
					} else {
						map.checkCollides(p, MASK.wall, handleCollision);
					}

					// collide with target
					map.checkCollides(p, MASK.target, handleCollision);

					// check collisions with players of different color
					_.each(players, function (otherList, otherColor) {
						if (color !== otherColor) {
							_.each(otherList, function (other) {
								if (!other.isDead() && p.collideWithOther(other)) {
									killPlayer(other);
									killPlayer(p);
								}
							});
						}
					});

				}
			});
		});
	};

	this.render = function (dt) {
		_.each(players, function (v, k) {
			_.each(v, function (p) {
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
		});

		if (playerToWatch) {
			scene.follow(playerToWatch.position());
		}
		scene.render();
	};

	this.isComplete = function () {
		if (playerToWatch.isDead() && targets[playerToWatch.getColor().getHexString()].length <= 0) {
			return true;
		}
		return false;
	};

	this.loadLevel = function (levelToLoad, input, colorMode) {
		var player, stored, color = new THREE.Color(parseInt(colorMode, 16));
		stored = storage.level(levelToLoad.id) || [];

		var getSpawn = function (color) {
			var spawn = JSON.parse(JSON.stringify(level.spawn[color]));
			spawn.x += 0.5;
			spawn.y += 0.5;
			return spawn;
		};

		clear();
		level = levelToLoad;
		loadBlocks();

		_.each(level.target, function (target, color) {
			addTarget(target, color);
		});

		_.each(stored, function (list, color) {
			_.each(list, function (replay) {
				var c = new THREE.Color(parseInt(color, 16));
				player = new Player(c);
				player.setInput(new Input({replay: replay.r}));
				player.setSpawn(getSpawn(color));
				player.revive();
				addPlayer(player, c);
			});
		});

		if (input) {
			player = new Player(color);
			player.setInput(input);
			player.setSpawn(getSpawn(colorMode));
			player.revive();
			addPlayer(player, color);
			playerToWatch = player;
		} else {
			// TODO: watch a random player when we don't have input
			// playerToWatch = players[Math.floor(Math.random() * players.length)];
		}
	};

};

util.inherits(World, EventEmitter);

module.exports = World;
