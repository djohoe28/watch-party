// @ts-check

// FIXME
// Parsing error:
// C:\Users\DJoho\Unity\telhai-project-316294321\eslint.config.mjs
// was not found by the project service.
// Consider either including it in the tsconfig.json or including it in allowDefaultProject.eslint

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";

export default tseslint.config(
	eslint.configs.recommended,
	// tseslint.configs.recommended,
	// tseslint.configs.recommendedTypeChecked,
	tseslint.configs.strictTypeChecked,
	tseslint.configs.stylisticTypeChecked,
	{
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	prettierConfig
);
