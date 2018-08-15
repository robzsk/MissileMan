const THREE = require('three');

let depth;
let distSquared;
const pointToPos = new THREE.Vector2();
const np = new THREE.Vector2();
const cell = new THREE.Vector2();
const collision = { offset: new THREE.Vector2(), normal: new THREE.Vector2() };
const tmpV2 = new THREE.Vector2();

module.exports = (p, x, y) => {
	let p1;
	let p2;
	let n;
	let pLengthSq;
	const piece = new THREE.Vector2();

	var set = (p, x, y) => {
		if (typeof p === 'object') {
			p1 = { x: p.a[0] + x, y: p.a[1] + y };
			p2 = { x: p.b[0] + x, y: p.b[1] + y };
			n = { x: p.n[0], y: p.n[1] };
			piece.subVectors(p2, p1);
			pLengthSq = piece.lengthSq();
		}
	};

	const nearestPoint = point => {
		const normalizedProjection = tmpV2.subVectors(tmpV2.copy(point), p1).dot(piece);
		if (normalizedProjection < 0) {
			return p1;
		} else if (normalizedProjection > pLengthSq) {
			return p2;
		} else {
			return tmpV2.copy(piece)
				.multiplyScalar(normalizedProjection / pLengthSq)
				.add(p1);
		}
	};

  const detectCollision = point => {
    np.copy(nearestPoint(point));
    pointToPos.copy(point).sub(np);
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

	set(p, x, y);

	return {
		p1,
		p2,
		n,
		set,
		detectCollision,
	};
};
