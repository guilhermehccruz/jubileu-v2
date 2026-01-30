import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default tseslint.config(
	eslint.configs.recommended,
	tseslint.configs.strict,
	tseslint.configs.stylistic,
	eslintConfigPrettier,
	{
		// Habilita o suporte a tipos (necessário para no-floating-promises)
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		ignores: ['dist', 'node_modules'],
		rules: {
			'@typescript-eslint/no-floating-promises': ['error', {
				ignoreVoid: true
			}],
			'@typescript-eslint/no-non-null-assertion': 'off',
			'@typescript-eslint/no-unused-expressions': ['error', {
				allowShortCircuit: true,
				allowTernary: true
			}]
		}
	}
);