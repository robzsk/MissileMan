const mask = require('./mask');

const addWalls = (scene, assets, walls) => {
  walls.forEach((row, y) => {
    row.forEach((cell, x) => {
      let cube;
      switch (cell) {
        case mask.TARGET:
          cube = assets.model.target();
          cube.position.set(x, y, 0);
          break;
        case mask.WALL:
          cube = assets.model.wall();
          cube.position.set(x, y, 0);
          break;
        case mask.MISSILE:
          cube = assets.model.missileOnly();
            cube.position.set(x, y, -1);
          break;
      }
      if (cube) {
        scene.add(cube);
      }
    });
  })
};

module.exports = (scene, assets) => ({
  addWalls: walls => addWalls(scene, assets, walls),
});
