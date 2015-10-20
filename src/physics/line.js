// PROTOTYPE
// TODO:major refactor this
// TODO: move this into a map module
var lines = [];

// top
lines.push([
  [], // 000
  [ { a: [1, 1], b: [2, 1] } ], // 001
  [ { a: [0, 1], b: [1, 1] } ], // 010
  [ { a: [0, 1], b: [2, 1] } ], // 011
  [ { a: [-1, 1], b: [0, 1] } ], // 100
  [ { a: [-1, 1], b: [0, 1] }, { a: [1, 1], b: [2, 1] } ], // 101
  [ { a: [-1, 1], b: [1, 1] } ], // 110
  [ { a: [-1, 1], b: [2, 1] } ] // 111
]);

// bottom
lines.push([
  [], // 000
  [ { a: [1, 0], b: [2, 0] } ], // 001
  [ { a: [0, 0], b: [1, 0] } ], // 010
  [ { a: [0, 0], b: [2, 0] } ], // 011
  [ { a: [-1, 0], b: [0, 0] } ], // 100
  [ { a: [-1, 0], b: [0, 0] }, { a: [1, 0], b: [2, 0] } ], // 101
  [ { a: [-1, 0], b: [1, 0] } ], // 110
  [ { a: [-1, 0], b: [2, 0] } ] // 111
]);

// left
// from bottom up
lines.push([
  [], // 000
  [ { a: [0, 1], b: [0, 2] } ], // 001
  [ { a: [0, 0], b: [0, 1] } ], // 010
  [ { a: [0, 0], b: [0, 2] } ], // 011
  [ { a: [0, -1], b: [0, 0] } ], // 100
  [ { a: [0, -1], b: [0, 0] }, { a: [0, 1], b: [0, 2] } ], // 101
  [ { a: [0, -1], b: [0, 1] } ], // 110
  [ { a: [0, -1], b: [0, 2] } ] // 111
]);

// right
// from bottom up
lines.push([
  [], // 000
  [ { a: [1, 1], b: [1, 2] } ], // 001
  [ { a: [1, 0], b: [1, 1] } ], // 010
  [ { a: [1, 0], b: [1, 2] } ], // 011
  [ { a: [1, -1], b: [1, 0] } ], // 100
  [ { a: [1, -1], b: [1, 0] }, { a: [1, 1], b: [1, 2] } ], // 101
  [ { a: [1, -1], b: [1, 1] } ], // 110
  [ { a: [1, -1], b: [1, 2] } ] // 111
]);

module.exports = {
  createLine: function (p) {
    var p1 = {x: p.a[0], y: p.a[1], z: 0};
    var p2 = {x: p.b[0], y: p.b[1], z: 0};

    var piece = function () {
      var piece = new THREE.Vector2();
      return piece.subVectors(p2, p1);
    }();

    var pLengthSq = function () {
      return piece.lengthSq();
    }();

    return {
      p1: p1,
      p2: p2,

      // find the nearest point to the given point on this line
      nearestPoint: function () {
        var tmp = new THREE.Vector2(),
          p = tmp.clone();
        return function (point) {
          var normalizedProjection = tmp.subVectors(p.copy(point), p1).dot(piece);
          if (normalizedProjection < 0) {
            return p1;
          } else if (normalizedProjection > pLengthSq) {
            return p2;
          } else {
            return tmp.copy(piece)
              .multiplyScalar(normalizedProjection / pLengthSq)
              .add(p1);
          }

        };
      }()

    };
  },

  // TODO: this does not belong here. perhaps put in a map module
  // where n is a number between 0-7 inclusive
  //      d is direction 'up', 'down', 'left', 'right'
  makeLines: function (n, d) {
    switch (d) {
      case 'top':
        return lines[0][n];
      case 'bottom':
        return lines[1][n];
      case 'left':
        return lines[2][n];
      case 'right':
        return lines[3][n];
    }
    return [];
  }
};
