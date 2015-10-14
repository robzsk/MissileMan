// PROTOTYPE
// TODO:major refactor this
// TODO: move this into a map module
var lines = [];

// top
lines.push([
  [], // 000
  [ { a: [2, 2], b: [3, 2] } ], // 001
  [ { a: [1, 2], b: [2, 2] } ], // 010
  [ { a: [1, 2], b: [3, 2] } ], // 011
  [ { a: [0, 2], b: [1, 2] } ], // 100
  [ { a: [0, 2], b: [1, 2] }, { a: [2, 2], b: [3, 2] } ], // 101
  [ { a: [0, 2], b: [2, 2] } ], // 110
  [ { a: [0, 2], b: [3, 2] } ] // 111
]);

// bottom
lines.push([
  [], // 000
  [ { a: [2, 1], b: [3, 1] } ], // 001
  [ { a: [1, 1], b: [2, 1] } ], // 010
  [ { a: [1, 1], b: [3, 1] } ], // 011
  [ { a: [0, 1], b: [1, 1] } ], // 100
  [ { a: [0, 1], b: [1, 1] }, { a: [2, 1], b: [3, 1] } ], // 101
  [ { a: [0, 1], b: [2, 1] } ], // 110
  [ { a: [0, 1], b: [3, 1] } ] // 111
]);

// left
// from bottom up
lines.push([
  [], // 000
  [ { a: [1, 0], b: [1, 1] } ], // 001
  [ { a: [1, 1], b: [1, 2] } ], // 010
  [ { a: [1, 1], b: [1, 3] } ], // 011
  [ { a: [1, 0], b: [1, 1] } ], // 100
  [ { a: [1, 0], b: [1, 1] }, { a: [1, 2], b: [1, 3] } ], // 101
  [ { a: [1, 0], b: [1, 2] } ], // 110
  [ { a: [1, 0], b: [1, 3] } ] // 111
]);

// right
// from bottom up
lines.push([
  [], // 000
  [ { a: [2, 0], b: [2, 1] } ], // 001
  [ { a: [2, 1], b: [2, 2] } ], // 010
  [ { a: [2, 1], b: [2, 3] } ], // 011
  [ { a: [2, 0], b: [2, 1] } ], // 100
  [ { a: [2, 0], b: [2, 1] }, { a: [2, 2], b: [2, 3] } ], // 101
  [ { a: [2, 0], b: [2, 2] } ], // 110
  [ { a: [2, 0], b: [2, 3] } ] // 111
]);

var tmp = new THREE.Vector3();

module.exports = {
  createLine: function (p) {
    var p1 = {x: p.a[0], y: p.a[1], z: 0};
    var p2 = {x: p.b[0], y: p.b[1], z: 0};

    var piece = function () {
      var piece = new THREE.Vector3();
      return piece.subVectors(p2, p1);
    }();

    return {
      p1: p1,
      p2: p2,

      // find the nearest point to the given point on this line
      nearestPoint: function (point) {
        point.z = point.z || 0;
        var normalizedProjection = tmp.subVectors(point, p1).setZ(0).dot(piece);
        if (normalizedProjection < 0) {
          return p1;
        } else if (normalizedProjection > piece.lengthSq()) { // TODO: could cache lengthSq()
          return p2;
        } else {
          return tmp.copy(piece).multiplyScalar(normalizedProjection / piece.lengthSq()).add(p1).clone();
        }
      }
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
