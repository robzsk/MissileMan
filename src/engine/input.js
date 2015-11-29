'use strict';

var $ = require('jquery'),
	_ = require('underscore'),
	util = require('util'),
	EventEmitter = require('events').EventEmitter;

var ReplayInput = function (file) {
	var moves = file ? JSON.parse(file) : [], self = this;

	EventEmitter.call(this);

	this.update = function (tick) {
		var m = moves[tick.toString()];
		if (m) {
			self.emit('input.move', _.clone(m));
		}
	};

	this.serialize = function () {
		return JSON.stringify(moves);
	};

};
util.inherits(ReplayInput, EventEmitter);

var GamepadInput = function (index, buttons) {
	var current = _.mapObject(buttons, function () { return false; }),
		prev = _.clone(current), moves = {}, self = this;

	EventEmitter.call(this);

	var poll = function () {
		var pad = navigator.getGamepads()[index];
		_.each(buttons, function (button, action) {
			current[action] = pad.buttons[button].pressed;
		});
	};

	this.reset = function () {
		moves = {};
		self.removeAllListeners('input.move');
	};

	this.serialize = function () {
		return JSON.stringify(moves);
	};

	this.update = function (tick) {
		poll();
		if (!_.isMatch(current, prev)) {
			moves[tick.toString()] = _.clone(current);
			self.emit('input.move', _.clone(current));
			_.extend(prev, current); // copy
		}
	};
};
util.inherits(GamepadInput, EventEmitter);

var KeyboardInput = function (keys) {
	var current = _.mapObject(keys, function () { return false; }),
		prev = _.clone(current), moves = {}, self = this;

	EventEmitter.call(this);

	var onkey = function (ev, kc, down) {
		_.findKey(keys, function (v, k) {
			if (v === kc) {
				current[k] = down;
				ev.preventDefault();
				return true;
			}
		});
	};

	$(document.body).on('keydown', function (ev) { return onkey(ev, ev.keyCode, true); });
	document.body.addEventListener('keyup', function (ev) { return onkey(ev, ev.keyCode, false); });

	this.reset = function () {
		moves = {};
		self.removeAllListeners('input.move');
	};

	this.serialize = function () {
		return JSON.stringify(moves);
	};

	this.update = function (tick) {
		if (!_.isMatch(current, prev)) {
			moves[tick.toString()] = _.clone(current);
			self.emit('input.move', _.clone(current));
			_.extend(prev, current); // copy
		}
	};
};
util.inherits(KeyboardInput, EventEmitter);

module.exports = function (config) {
	config = config || {};
	if (typeof config.gamepad === 'object') {
		return new GamepadInput(config.gamepad.index, config.buttons);
	} else if (typeof config.keys === 'object') {
		return new KeyboardInput(config.keys);
	} else {
		return new ReplayInput(config.replay);
	}
};
