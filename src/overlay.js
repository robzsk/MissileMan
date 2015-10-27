module.exports = function () {
  'use strict';

  const event = require('./engine/event');
  var overlay, input;

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
        event(overlay).trigger('title.playbutton.click');
      })
      .text('Play');
    $('body').append(b);
    return b;
  }();

  var onInput = function (m) {
    if (m.select) {
      event(overlay).trigger('title.playbutton.click');
      event(input).off('input.move', onInput);
    }
  };

  overlay = {
    fadeFromBlack: function () {
      fader.css({opacity: 1});
      fader.stop().animate({opacity: 0}, 600);
    },

    showTitle: function (i) {
      button.stop()
        .animate({bottom: '100px'}, 600, 'easeOutBack');
      input = i;
      event(input).on('input.move', onInput);
    },

    hideTitle: function () {
      button.stop()
        .animate({bottom: '-100px'}, 400, 'easeInBack');
    }

  };
  return overlay;
}();
