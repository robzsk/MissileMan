'use strict';

module.exports = {
	load: function (n) {
		return require('./data/' + n)();
	},
	total: function () {
		return 2;
	}
};
