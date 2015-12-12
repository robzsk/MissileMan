'use strict';

var $ = require('jquery'),
	util = require('util'),
	EventEmitter = require('events').EventEmitter,
	Input = require('../engine/input');

var Overlay = function () {
	var self = this,
		input = new Input({ keys: { up: 38, down: 40, select: 13 } });

	EventEmitter.call(this);

	var fader = function () {
		var f = $('<div/>')
			.css({
				position: 'fixed',
				backgroundColor: 'black',
				height: '100%',
				width: '100%',
				margin: 0,
				padding: 0,
			// opacity: 0
			});
		$('body').append(f);
		return f;
	}();

	var button = function () {
		var b = $('<button>')
			.css({
				position: 'fixed',
				bottom: '100px',
				left: '50%'
			})
			.click(function () {
				self.emit('title.playbutton.click');
			})
			.text('Play');
		$('body').append(b);
		return b;
	}();

	var title = function () {
		var t = $('<img src="assets/title.png">')
			.css({
				position: 'fixed',
				top: '100px',
				left: ($(window).width() / 2) - 250
			});
		$('body').append(t);

		return t;
	}();

	var onInput = function (m) {
		if (m.select) {
			self.emit('title.playbutton.click');
		}
	};

	this.fadeFromBlack = function () {
		fader.css({opacity: 1});
		fader.stop().animate({opacity: 0}, 600);
	};

	this.showTitle = function () {
		button.show();
		title.show();
		input.removeListener('input.move', onInput);
		input.on('input.move', onInput);
	};

	this.hideTitle = function () {
		button.hide();
		title.hide();
	};

	this.isVisible = function () {
		return title.is(':visible');
	};

	this.update = function (ticks) {
		input.update(ticks);
	};

};

util.inherits(Overlay, EventEmitter);

module.exports = Overlay;
