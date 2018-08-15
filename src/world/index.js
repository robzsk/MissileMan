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
            // TODO: factor this out
            api.emit('player.win', player.getSerializedInput());
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
    renderer = createRenderer(scene, assets);
    map.addBlocks(level.walls);
    addTarget(level.target, assets);
    addPlayer(input, assets);
    renderer.addWalls(level.walls);
  };

  events(api);
  return api;
};
