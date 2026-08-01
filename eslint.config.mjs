import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";

export default tseslint.config(
	{
		ignores: ["eslint.config.mjs", "dist"]
	},
	eslint.configs.recommended,
	// tseslint.configs.recommended,
	// tseslint.configs.recommendedTypeChecked,
	tseslint.configs.strictTypeChecked,
	tseslint.configs.stylisticTypeChecked,
	{
		languageOptions: {
			parserOptions: {
				projectService: {
					allowDefaultProject: ["eslint.config.mjs"],
					defaultProject: "tsconfig.json",
				},
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	prettierConfig
);
