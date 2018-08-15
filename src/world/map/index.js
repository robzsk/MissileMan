const { raw, optimised, add } = require('./configs');
const createLine = require('./line');

module.exports = () => {
	let cells = [];
	const tcell = (tx, ty) => cells[ty][tx];

	const clear = () => {
		cells = [];
	};

	const removeBlock = (x, y) => {
		cells[y][x] = 0;
	};

	const addBlocks = blocks => {
		cells = blocks;
	};

	const setBlock = (x, y, mask) => {
		cells[y][x] = mask;
	};

	const tmpLine = createLine();
	const checkRawLines = (x, y, i, handler, entity, layer) => {
		raw[i].forEach(l => {
			tmpLine.set(l, x, y);
			entity.getPoints().forEach(p => {
				const collision = tmpLine.detectCollision(p);
				if (collision) {
					collision.x = x + add[i][0];
					collision.y = y + add[i][1];
					handler(entity, collision, layer);
				}
			});
		});
	};

	const checkCollides = (entity, layer, handler) => {
		const x = Math.floor(entity.position().x);
		const y = Math.floor(entity.position().y);
		add.forEach((a, n) => {
			if (tcell(x + a[0], y + a[1]) === layer) {
				checkRawLines(x, y, n, handler, entity, layer);
			}
		});
	};

	const linePool = [];
	const getOptimisedLines = (entity, layer) => {
		const x = Math.floor(entity.position().x);
		const y = Math.floor(entity.position().y);
		const ret = [];
		let mask = 0;
		add.forEach(a => {
			mask += tcell(x + a[0], y + a[1]) === layer ? a[2]: 0;
		});
		optimised[mask].forEach(l => {
			let line;
			// allocate a new line from the linePool
			if (linePool.length <= ret.length) {
				line = createLine(l, x, y);
				linePool.push(line);
			} else {
				line = linePool[ret.length];
				line.set(l, x, y);
			}
			ret.push(line);
		});
		return ret;
	};

	const handleCollides = (entity, layer) => {
		const lines = getOptimisedLines(entity, layer);
		lines.forEach(l => {
			entity.getPoints().forEach(p => {
				const collision = l.detectCollision(p);
				if (collision) {
					entity.handleCollision(collision);
				}
			});
		});
	};

	return {
		clear,
		removeBlock,
		addBlocks,
		setBlock,
		handleCollides,
		checkCollides,
	};
};
