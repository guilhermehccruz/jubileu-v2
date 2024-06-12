module.exports = {
	'env': {
		'es2022': true,
		'node': true,
		'jest': true,
	},
	'extends': [
		'eslint:recommended',
		'plugin:@typescript-eslint/strict-type-checked',
		'plugin:@typescript-eslint/stylistic-type-checked',
		'prettier',
		'plugin:prettier/recommended',
		'plugin:import/recommended',
		'plugin:import/typescript'
	],
	'parser': '@typescript-eslint/parser',
	'parserOptions': {
		'ecmaVersion': 'latest',
		'sourceType': 'module',
		'tsconfigRootDir': __dirname,
		'project': ['./tsconfig.json'],
	},
	'plugins': [
		'@typescript-eslint',
		'import',
		'eslint-plugin-import-helpers',
		'prettier',
		'no-relative-import-paths',
		'deprecation'
	],
	'rules': {
		'@typescript-eslint/naming-convention': [
			'error',
			{
				'selector': 'interface',
				'format': ['PascalCase'],
				'custom': {
					'regex': '^I[A-Z]',
					'match': true
				}
			}
		],
		'import-helpers/order-imports': [
			'error',
			{
				'newlinesBetween': 'always',
				'groups': ['module', '/^@\//', ['sibling', 'index']],
				'alphabetize': { 'order': 'asc', 'ignoreCase': true }
			}
		],
		"no-relative-import-paths/no-relative-import-paths": ["warn", { "allowSameFolder": false }],
		'import/no-extraneous-dependencies': [
			'error',
			{ 'devDependencies': true }
		],
		'prettier/prettier': [
			'error',
			{
				'singleQuote': true,
				'printWidth': 120,
				'useTabs': true,
				'tabWidth': 4,
			}
		],
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-extraneous-class': ['error', { 'allowWithDecorator': true }],
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/no-unused-vars': ["warn", { "ignoreRestSiblings": true }],
		'deprecation/deprecation': 'error',
		'@typescript-eslint/prefer-nullish-coalescing': ['error', { ignoreConditionalTests: true }],
		'@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
	},
	'settings': {
		'import/resolver': {
			typescript: true,
			node: true,
		}
	},
	'root': true,
};
