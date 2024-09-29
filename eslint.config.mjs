import globals from 'globals'
import pluginJs from '@eslint/js'
import tsEslint from 'typescript-eslint'
// import vueEslintParser from 'vue-eslint-parser'
// import vueEslintPlugin from 'eslint-plugin-vue'

export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
  //Je n'arrive pas à trouver la configuration de vue avec le script setup
  // {
  //   files: ['**/*.vue'],
  //   languageOptions: {
  //     parser: vueEslintParser
  //   },
  //   plugins: {
  //     vue: vueEslintPlugin
  //   },
  //   rules: {
  //     'vue/script-setup-uses-vars': 'error'
  //   }
  // },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tsEslint.configs.recommended
]
