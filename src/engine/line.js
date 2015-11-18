'use strict';

var THREE = require('three');

var Line = function (p, x, y) {
	var p1, p2, n, piece = new THREE.Vector2(), pLengthSq;

	var set = function (p, x, y) {
		if (typeof p === 'object') {
			p1 = {x: p.a[0] + x, y: p.a[1] + y};
			p2 = {x: p.b[0] + x, y: p.b[1] + y};
			n = {x: p.n[0], y: p.n[1]};
			piece.subVectors(p2, p1);
			pLengthSq = piece.lengthSq();
		}
		return this;
	};

	var nearestPoint = function () {
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
	}();

	set(p, x, y);

	return {
		p1: p1,
		p2: p2,
		n: n,
		set: set,

		detectCollision: function () {
			var pointToPos = new THREE.Vector2(),
				depth, np = new THREE.Vector2(), cell = new THREE.Vector2(),
				collision = { offset: new THREE.Vector2(), normal: new THREE.Vector2() },
				distSquared;
			return function (point) {
				np.copy(nearestPoint(point));
				pointToPos.copy(point)
					.sub(np);
				collision.normal.copy(pointToPos).normalize();
				if (collision.normal.dot(n) >= 0) { // behind the line?
					distSquared = pointToPos.lengthSq();
					if (distSquared < point.rs) {
						depth = point.r - Math.sqrt(distSquared);
						collision.offset.copy(pointToPos.normalize().multiplyScalar(depth));
						return collision;
					}
				}
			};
		}()

	};
};

module.exports = Line;
