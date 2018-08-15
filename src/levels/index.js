const levels = [
	require('./data/level_0'),
	require('./data/level_1')
];

module.exports = {
	load: n => levels[n](),
	total: () => 2,
};
