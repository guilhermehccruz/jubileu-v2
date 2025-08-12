// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default tseslint.config(
	eslint.configs.recommended,
	tseslint.configs.strict,
	tseslint.configs.stylistic,
	eslintConfigPrettier,
	{
		ignores: ['dist', 'node_modules'],
		rules: {
			'@typescript-eslint/no-non-null-assertion': 'off',
			'@typescript-eslint/no-unused-expressions': ['error', {
				allowShortCircuit: true,
				allowTernary: true
			}]
		}
	}
);
