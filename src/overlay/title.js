const $ = require('jquery');
const event = require('minivents');

module.exports = parent => {
  const api = {};

  const title = $('<span/>')
    .css({
      fontSize: '150px',
      textShadow: '-5px 5px 0 #3774c4',
      position: 'fixed',
      right: '10px',
      top: '-40px',
    })
    .text('Missileman')
    .hide();
  $(parent).append(title);

  const press = $('<span/>')
    .css({
      fontSize: '50px',
      textShadow: '-2px 2px 0 #3774c4',
      position: 'fixed',
      left: '50px',
      bottom: '40px',
    })
    .text('press space to start')
    .hide();
  $(parent).append(press);

  const onKey = ev => {
    if (ev.keyCode === 32) {
      api.emit('start');
    }
  };

  api.show = () => {
    document.body.addEventListener('keydown', onKey);
    title.show();
    press.show();
  };

  api.hide = () => {
    document.body.removeEventListener('keydown', onKey);
    title.hide();
    press.hide();
  };

  event(api);
  return api;
};
