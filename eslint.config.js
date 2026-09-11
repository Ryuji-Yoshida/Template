import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
  js.configs.recommended,
  eslintConfigPrettier, // Prettierとのルールの衝突を無効化
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser, // consoleやdocumentなど
        ...globals.node, // processやrequireなど
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  {
    // ビルド生成物やキャッシュを除外
    ignores: ['dist/**', '_site/**', '.cache/**'],
  },
];