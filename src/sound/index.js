const { Howl } = require('howler');

const exp = new Howl({
  src: ['./sound/explosion.wav'],
});

const unl = new Howl({
  src: ['./sound/unlock.wav'],
});

const morMan = new Howl({
  src: ['./sound/morphToMan.wav'],
});

const morMissile = new Howl({
  src: ['./sound/morphToMissile.wav'],
});

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

const engine = () => {
  const eng = new Howl({
    src: ['./sound/engine.wav'],
    loop: true,
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
