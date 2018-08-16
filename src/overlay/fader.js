const $ = require('jquery');

module.exports = (parent) => {
  const element = $('<div/>')
    .css({
      position: 'absolute',
      backgroundColor: 'black',
      height: '100%',
      width: '100%',
      margin: 0,
      padding: 0,
      top: 0,
      left: 0,
    });

  // $(parent).append(element);
  $('body').append(element);

  const fadeFromBlack = () => {
		element.css({ opacity: 1 });
		element.stop().animate({ opacity: 0 }, 600);
	};

  return {
    fadeFromBlack,
  };
};
