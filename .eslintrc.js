module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	parserOptions: {
		tsconfigRootDir: __dirname,
		project: ['./tsconfig.json'],
	},
	plugins: [
		'@typescript-eslint',
		'prettier',
		'import',
		'import-helpers'
	],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'plugin:@typescript-eslint/strict',
		'prettier',
		'plugin:prettier/recommended'
	],
	rules: {
		camelcase: 'error',
		'import/no-unresolved': "error",
		'@typescript-eslint/naming-convention': [
			'error',
			{
				selector: 'interface',
				format: [
					'PascalCase'
				],
				custom: {
					regex: '^I[A-Z]',
					match: true
				}
			}
		],
		'class-methods-use-this': 'off',
		'import/prefer-default-export': 'off',
		'no-shadow': 'off',
		'no-console': 'off',
		'no-useless-constructor': 'off',
		'no-empty-function': 'off',
		'lines-between-class-members': 'off',
		'import/extensions': [
			'error',
			'ignorePackages',
			{
				'ts': 'never'
			}
		],
		'import-helpers/order-imports': [
			'warn',
			{
				'newlinesBetween': 'always',
				'groups': [
					'module',
					'/^@/',
					[
						'parent',
						'sibling',
						'index'
					]
				],
				'alphabetize': {
					'order': 'asc',
					'ignoreCase': true
				}
			}
		],
		'import/no-extraneous-dependencies': [
			'error',
			{
				'devDependencies': [
					'**/*.spec.js',
					'jest.config.ts'
				]
			}
		],
		'prettier/prettier': [
			'error',
			{
				'singleQuote': true,
				'printWidth': 120
			}
		]
	}
};