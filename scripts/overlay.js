module.exports = function () {
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

  return {
    fadeFromBlack: function () {
      fader.css({opacity: 1});
      fader.stop().animate({opacity: 0}, 600);
    }
  };
}();
