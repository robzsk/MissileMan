module.exports = {
	player: {
		'name': 'CubeGeometry.3',
		'materials': [{
			'transparent': false,
			'DbgIndex': 0,
			'blending': 'NormalBlending',
			'colorEmissive': [0, 0, 0],
			'wireframe': false,
			'DbgName': 'Body',
			'shading': 'lambert',
			'colorDiffuse': [1, 1, 1],
			'depthWrite': true,
			'depthTest': true,
			'visible': true,
			'opacity': 1
		}, {
			'transparent': false,
			'DbgIndex': 1,
			'blending': 'NormalBlending',
			'colorEmissive': [0, 0, 0],
			'wireframe': false,
			'DbgName': 'Head',
			'shading': 'lambert',
			'colorDiffuse': [0.169, 0.367, 0.91],
			'depthWrite': true,
			'depthTest': true,
			'visible': true,
			'opacity': 1
		}],
		'normals': [0, 0, 1],
		'metadata': {
			'normals': 1,
			'generator': 'io_three',
			'materials': 2,
			'type': 'Geometry',
			'version': 3,
			'faces': 2,
			'vertices': 6
		},
		'vertices': [0.169947, -0.50984, -0, -0.169947, -0.50984, -0, -0.169947, 0.50984, -0, 0.169947, 0.50984, 0, -0.169947, 0.169947, -0, 0.169947, 0.169947, -0],
		'faces': [35, 5, 3, 2, 4, 1, 0, 0, 0, 0, 35, 0, 5, 4, 1, 0, 0, 0, 0, 0]
	},
	empty: {
		'metadata': {
			'version': 3,
			'generator': 'io_three',
			'vertices': 4,
			'uvs': 0,
			'faces': 1,
			'type': 'Geometry',
			'normals': 2
		},
		'vertices': [1, 0, 0, 0, 0, -0, 1, 1, 0, 0, 1, -0],
		'uvs': [],
		'name': 'CubeGeometry.4',
		'faces': [33, 1, 0, 2, 3, 0, 1, 1, 1],
		'normals': [0, 0, 0.999969, 0, 0, 1]
	},
	solid: {
		'metadata': {
			'version': 3,
			'generator': 'io_three',
			'vertices': 8,
			'uvs': 0,
			'faces': 6,
			'type': 'Geometry',
			'normals': 8
		},
		'vertices': [1, 0, 0, 1, 0, 1, -0, 0, 1, 0, 0, -0, 1, 1, 0, 1, 1, 1, -0, 1, 1, 0, 1, -0],
		'uvs': [],
		'name': 'CubeGeometry.2',
		'faces': [33, 0, 1, 2, 3, 0, 1, 2, 3, 33, 4, 7, 6, 5, 4, 5, 6, 7, 33, 0, 4, 5, 1, 0, 4, 7, 1, 33, 1, 5, 6, 2, 1, 7, 6, 2, 33, 2, 6, 7, 3, 2, 6, 5, 3, 33, 4, 0, 3, 7, 4, 0, 3, 5],
		'normals': [0.577349, -0.577349, -0.577349, 0.577349, -0.577349, 0.577349, -0.577349, -0.577349, 0.577349, -0.577349, -0.577349, -0.577349, 0.577349, 0.577349, -0.577349, -0.577349, 0.577349, -0.577349, -0.577349, 0.577349, 0.577349, 0.577349, 0.577349, 0.577349]
	}
};
