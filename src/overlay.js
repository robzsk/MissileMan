'use strict';

var util = require('util'),
  EventEmitter = require('events').EventEmitter;

var Overlay = function () {
  var input, self = this;

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
        bottom: '-100px',
        left: '50%'
      })
      .click(function () {
        self.emit('title.playbutton.click');
      })
      .text('Play');
    $('body').append(b);
    return b;
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

  this.showTitle = function (i) {
    button.stop()
      .animate({bottom: '100px'}, 600, 'easeOutBack');
    input = i;
    input.removeListener('input.move', onInput);
    input.on('input.move', onInput);
  };

  this.hideTitle = function () {
    button.stop()
      .animate({bottom: '-100px'}, 400, 'easeInBack');
  };

};

util.inherits(Overlay, EventEmitter);

module.exports = Overlay;
