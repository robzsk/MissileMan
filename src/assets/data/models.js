module.exports = {
	player: {
		'uvs': [],
		'name': 'Cube.003Geometry',
		'vertices': [-0.2, -0.5, 0, 0.2, 0.1, -0, 0.2, -0.5, 0, -0.2, 0.1, -0, -0.2, 0.1, -0, -0.2, 0.5, -0, 0.2, 0.1, -0, 0.2, 0.5, -0],
		'metadata': {
			'type': 'Geometry',
			'version': 3,
			'faces': 2,
			'uvs': 0,
			'vertices': 8,
			'materials': 2,
			'generator': 'io_three',
			'normals': 1
		},
		'materials': [{
			'opacity': 1,
			'DbgIndex': 0,
			'transparent': false,
			'DbgName': 'Material.002',
			'colorEmissive': [0, 0, 0],
			'shading': 'lambert',
			'blending': 'NormalBlending',
			'depthTest': true,
			'colorDiffuse': [0.8, 0.8, 0.8],
			'wireframe': false,
			'visible': true,
			'depthWrite': true
		}, {
			'opacity': 1,
			'DbgIndex': 1,
			'transparent': false,
			'DbgName': 'Material.003',
			'colorEmissive': [0, 0, 0],
			'shading': 'lambert',
			'blending': 'NormalBlending',
			'depthTest': true,
			'colorDiffuse': [0, 0, 1],
			'wireframe': false,
			'visible': true,
			'depthWrite': true
		}],
		'faces': [35, 3, 0, 2, 1, 0, 0, 0, 0, 0, 35, 7, 5, 4, 6, 1, 0, 0, 0, 0],
		'normals': [0, 0, 1]
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
	solid_1: {
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
