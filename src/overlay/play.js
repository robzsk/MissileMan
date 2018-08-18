const $ = require('jquery');
const event = require('minivents');

module.exports = parent => {
  const api = {};
  let timer = 0;

  const container = $('<div/>')
    .css({
      position: 'absolute',
      height: '100%',
      width: '100%',
      margin: 0,
      padding: 0,
      top: 0,
      left: 0,
      textAlign: 'center',
    })
    .hide();
  $(parent).append(container);

  const quit = $('<span/>')
    .css({
      position: 'fixed',
      right: '10px',
      fontSize: '50px',
      textShadow: '-2px 2px 0 #3774c4',
    })
    .text('(Q)uit');
  $(container).append(quit);

  const time = $('<div/>')
    .css({
      fontSize: '50px',
      textShadow: '-2px 2px 0 #3774c4',
    })
    .text('0.0');
  $(container).append(time);

  const onKey = ev => {
    if (ev.keyCode === 81) { // q
      api.emit('quit');
    }
  };

  const getTime = () =>
    // the game loop code need some work for now
    // this magic number works on my slow machine
    ((timer * 1.65) / 100).toFixed(1);

  api.show = () => {
    timer = 0;
    document.body.addEventListener('keydown', onKey);
    container.show();
  };

  api.hide = () => {
    document.body.removeEventListener('keydown', onKey);
    container.hide();
  };

  api.update = () => {
    timer += 1;
    time.text(`${getTime()}`);
  };

  api.getTime = getTime;

  event(api);
  return api;
};
