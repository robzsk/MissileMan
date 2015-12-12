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
		var div = $('<div>')
			.css({
				position: 'fixed',
				top: '100px',
				left: ($(window).width() / 2) - 250
			});

		var a = $('<img src="assets/title_a.png">')
			.css({
				position: 'absolute'
			});
		var b = $('<img src="assets/title_b.png">')
			.css({
				position: 'absolute'
			});
		div.append(a);
		// div.append(b);
		$('body').append(div);

		return div;
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
