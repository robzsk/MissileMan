
const WALL_MASK = {
  empty: 0,
  wall: 1
};

const addWalls = (scene, assets, walls) => {
  walls.forEach((row, y) => {
    row.forEach((cell, x) => {
      const cube = assets.model.cubeSolid(cell);
      if (cube) {
        cube.position.set(x, y, 0);
        scene.add(cube);
      }
    });
  })
};

module.exports = (scene, assets) => ({
  addWalls: walls => addWalls(scene, assets, walls),
});
