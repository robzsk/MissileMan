module.exports = function () {
  'use strict';

  var overlay;

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
        $(overlay).trigger('title.playbutton.click');
      })
      .text('Play');
    $('body').append(b);
    return b;
  }();

  overlay = {
    fadeFromBlack: function () {
      fader.css({opacity: 1});
      fader.stop().animate({opacity: 0}, 600);
    },

    showTitle: function () {
      button.stop()
        .animate({bottom: '100px'}, 600, 'easeOutBack');
    },

    hideTitle: function () {
      button.stop()
        .animate({bottom: '-100px'}, 400, 'easeInBack');
    }

  };
  return overlay;
}();
