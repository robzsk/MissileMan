'use strict';

var _ = require('underscore'),
	Input = require('./engine/input');

module.exports = function () {
	'use strict';
	var s = function (k, v) {
		if (k && v) {
			localStorage.setItem(k, JSON.stringify(v));
		} else if (k && !v) {
			return JSON.parse(localStorage.getItem(k));
		} else {
			console.error('Key was undefined while using local storage.');
		}
	};
	return {
		level: function (id, v) {
			return s('l' + id, v);
		}
	};
}();
