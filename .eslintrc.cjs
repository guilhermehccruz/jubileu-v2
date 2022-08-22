module.exports = {
	'env': {
		'es2022': true,
		'node': true
	},
	'extends': [
		'eslint:recommended',
		"plugin:@typescript-eslint/eslint-recommended",
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		"plugin:@typescript-eslint/strict",
		'prettier',
		'plugin:prettier/recommended',
	],
	'overrides': [
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
		'prettier'
	],
	'rules': {
		'indent': [
			'error',
			'tab'
		],
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'always'
		],
		'camelcase': 'off',
		'import/no-unresolved': 'error',
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
				'groups': ['module', '/^@shared/', ['parent', 'sibling', 'index']],
				'alphabetize': { 'order': 'asc', 'ignoreCase': true }
			}
		],
		'import/no-extraneous-dependencies': [
			'error',
			{ 'devDependencies': ['**/*.spec.js'] }
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
		'@typescript-eslint/no-non-null-assertion': 'off'
	},
	'settings': {
		'import/resolver': {
			'typescript': {}
		}
	},
	'root': true,
};
