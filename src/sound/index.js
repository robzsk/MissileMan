const { Howl } = require('howler');

const exp = new Howl({
  src: [require('./../../sound/explosion.wav')],
});

const unl = new Howl({
  src: [require('./../../sound/unlock.wav')],
});

const morMan = new Howl({
  src: [require('./../../sound/morphToMan.wav')],
});

const morMissile = new Howl({
  src: [require('./../../sound/morphToMissile.wav')],
});

const engine = () => {
  const eng = new Howl({
    src: [require('./../../sound/engine.wav')],
    loop: true,
    volume: 0.75,
  });
  const start = () => {
    eng.play();
  };
  const stop = () => {
    eng.stop();
  };
  return {
    start,
    stop,
  };
};

const unlock = () => {
  unl.play();
};

const explosion = () => {
  exp.play();
};

const morphToMan = () => {
  morMan.play();
};

const morphToMissile = () => {
  morMissile.play();
};

const stop = () => {
  Howler.stop();
};

module.exports = {
  unlock,
  explosion,
  morphToMan,
  morphToMissile,
  engine,
  stop,
};
