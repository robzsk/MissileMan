// 1 2 3
// 4   5
// 6 7 8
// or
//  1   2   4
//  8      16
// 32  64 128
var linesII = [
  [ { a: [0, 1], b: [-1, 1], n: [0, -1] }, { a: [0, 2], b: [0, 1], n: [1, 0] } ], // 1
  [ { a: [0, 1], b: [0, 2], n: [-1, 0] }, { a: [1, 1], b: [0, 1], n: [0, -1] }, { a: [1, 2], b: [1, 1], n: [1, 0] }], // 2
  [ { a: [2, 1], b: [1, 1], n: [0, -1] }, { a: [1, 1], b: [1, 2], n: [-1, 0] } ], // 3
  [ { a: [-1, 1], b: [0, 1], n: [0, 1] }, { a: [0, 1], b: [0, 0], n: [1, 0] }, { a: [0, 0], b: [-1, 0], n: [0, -1] } ], // 4
  [ { a: [1, 1], b: [2, 1], n: [0, 1] }, { a: [1, 0], b: [1, 1], n: [-1, 0] }, { a: [2, 0], b: [1, 0], n: [0, -1] } ], // 5
  [ { a: [-1, 0], b: [0, 0], n: [0, 1] }, { a: [0, 0], b: [0, -1], n: [1, 0] } ], // 6
  [ { a: [0, -1], b: [0, 0], n: [-1, 0] }, { a: [0, 0], b: [1, 0], n: [0, 1] }, { a: [1, 0], b: [1, -1], n: [1, 0] } ], // 7
  [ { a: [1, -1], b: [1, 0], n: [-1, 0] }, { a: [1, 0], b: [2, 0], n: [0, 1] } ], // 8
];

var clone = function (obj) {
  return JSON.parse(JSON.stringify(obj));
};
var output = [];

+function permutate () {
  _.times(256, function (n) {
    var a = [];
    _.times(8, function (b) {
      if (n & Math.pow(2, b)) {
        _.each(linesII[b], function (line) {
          a.push(clone(line));
        });
      }
    });
    output.push(a);
  });
}();

var count = function () {
  var c = 0;
  _.each(output, function (out) {
    c += out.length;
  });
  return c;
};
console.log('before: ' + count());

function optimise () {
  // remove opposing lines
  +function removeOpp () {
    _.each(output, function (lines, n) {
      _.each(lines, function (ln1) {
        var f = _.find(output[n], function (ln2) {
          if (ln1 === ln2) return false;
          return _.isEqual(ln1.a, ln2.b) && _.isEqual(ln1.b, ln2.a);
        });
        if (_.isObject(f)) {
          f.reject = ln1.reject = true;
        }
      });
      output[n] = _.reject(lines, function (ln) { return ln.reject; });
    });
  }();

  // add colinear
  +function addColinear () {
    _.each(output, function (lines, n) {
      _.each(lines, function (ln1) {
        _.each(lines, function (ln2) {
          if (ln1 === ln2 || ln1.reject || ln2.reject) {
            return;
          }
          if (_.isEqual(ln1.n, ln2.n)) { // normals are equal
            if (_.isEqual(ln1.b, ln2.a)) {
              ln1.b = clone(ln2.b);
              ln2.reject = true;
            }
          }
        });
      });
      output[n] = _.reject(lines, function (ln) { return ln.reject; });
    });
  }();

}
optimise();

console.log('after: ' + count());

_.each(output, function (out, n) {
  output[n] = JSON.stringify(out);
});
require('fs').writeFile('./test.json', 'var lines=' + JSON.stringify(output, null, 1).replace(/\\"/g, "'").replace(/"/g, '').replace(/'/g, '"') + ';');

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
