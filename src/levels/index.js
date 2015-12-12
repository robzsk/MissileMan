'use strict';

var levels = [
	require('./data/level_0'),
	require('./data/level_1')
];

module.exports = {
	load: function (n) {
		return levels[n]();
	},
	total: function () {
		return 2;
	}
};
