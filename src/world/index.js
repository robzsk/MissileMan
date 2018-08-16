const THREE = require('three');
const events = require('minivents');
const createRenderer = require('./renderer');

const color = new THREE.Color('rgb(55, 116, 196)');
const createPlayer = require('./player');
const map = require('./map')();

module.exports = scene => {
  let player;
  const api = {};
  let renderer;
  let timeoutWin;

  const addTarget = (position, assets) => {
    const target = assets.model.cubeTarget(color);
    target.position.set(position.x, position.y, 0);
    scene.add(target);
  };

  const addPlayer = (input, assets) => {
    player = createPlayer(color, scene, assets);
    player.setInput(input);
    player.setSpawn({ x: 1.5, y: 18.5 });
    player.revive();
  }

  api.update = (ticks, step) => {
    player.update(ticks, step);
    if (!player.isDead()) {
      if (player.isMan()) {
        map.handleCollides(player, 1); // MASK.wall);
      } else {
        map.checkCollides(player, 1, (player, collision, type) => {
          if (!player.isDead()) {
            player.kill();
            timeoutWin = setTimeout(() =>
              api.emit('player.lose', player.getSerializedInput())
            , 1000);
          }
        });
      }
    }
  };

  api.render = dt => {
    player.render(dt);
    scene.follow(player.position());
    scene.render();
  };

  api.load = (level, assets, input) => {
    clearTimeout(timeoutWin);
    renderer = createRenderer(scene, assets);
    map.addBlocks(level.walls);
    addTarget(level.target, assets);
    addPlayer(input, assets);
    renderer.addWalls(level.walls);
  };

  events(api);
  return api;
};
