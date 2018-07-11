const defaultFixable = {
  semi: ['error', 'always']
  // "mocha/no-mocha-arrows": "error",
  // "mocha/handle-done-callback": "error",
  // "mocha/no-exclusive-tests": "error",
  // "mocha/no-global-tests": "error",
  // "mocha/no-return-and-callback": "error",
  // "mocha/no-sibling-hooks": "error",
}

const nodeFixable = {
  'node/exports-style': 'error',
  'node/no-deprecated-api': 'error',
  'node/no-missing-import': 'error',
  'node/no-missing-require': 'error',
  'node/no-unpublished-bin': 'error',
  'node/no-unpublished-import': 'error',
  'node/no-unpublished-require': 'off',
  'node/no-unsupported-features': 'error',
  'node/process-exit-as-throw': 'error',
  'node/shebang': 'error'
}

const vueWarnList = [
  'vue/require-v-for-key',
  'vue/valid-v-for',
  'vue/no-unused-vars'
]

const defaultWarnList = [
  'no-console',
  'no-unused-vars',
  'no-empty',
  'no-undef',
  'no-unreachable',
  'no-useless-escape',
  'no-irregular-whitespace',
  'no-empty-pattern'
]

const warnList = vueWarnList.concat(defaultWarnList)

const warnThem = {
  'vue/html-indent': ['warn', 4],
  indent: ['warn', 4]
}

for (var idx in warnList) {
  warnThem[warnList[idx]] = 'warn'
}

// these rules will infect prettier, must be turned off
const eslintConfigPrettier = {
  'array-bracket-newline': 'off',
  'array-bracket-spacing': 'off',
  'array-element-newline': 'off',
  'arrow-parens': 'off',
  'arrow-spacing': 'off',
  'block-spacing': 'off',
  'brace-style': 'off',
  'comma-dangle': 'off',
  'comma-spacing': 'off',
  'comma-style': 'off',
  'computed-property-spacing': 'off',
  'dot-location': 'off',
  'eol-last': 'off',
  'func-call-spacing': 'off',
  'function-paren-newline': 'off',
  'generator-star': 'off',
  'generator-star-spacing': 'off',
  'implicit-arrow-linebreak': 'off',
  indent: 'off',
  'indent-legacy': 'off',
  'jsx-quotes': 'off',
  'key-spacing': 'off',
  'keyword-spacing': 'off',
  'multiline-ternary': 'off',
  'newline-per-chained-call': 'off',
  'new-parens': 'off',
  'no-arrow-condition': 'off',
  'no-comma-dangle': 'off',
  'no-extra-parens': 'off',
  'no-extra-semi': 'off',
  'no-floating-decimal': 'off',
  'no-mixed-spaces-and-tabs': 'off',
  'no-multi-spaces': 'off',
  'no-multiple-empty-lines': 'off',
  'no-reserved-keys': 'off',
  'no-space-before-semi': 'off',
  'no-spaced-func': 'off',
  'no-trailing-spaces': 'off',
  'no-whitespace-before-property': 'off',
  'no-wrap-func': 'off',
  'nonblock-statement-body-position': 'off',
  'object-curly-newline': 'off',
  'object-curly-spacing': 'off',
  'object-property-newline': 'off',
  'one-var-declaration-per-line': 'off',
  'operator-linebreak': 'off',
  'padded-blocks': 'off',
  'quote-props': 'off',
  'rest-spread-spacing': 'off',
  semi: 'off',
  'semi-spacing': 'off',
  'semi-style': 'off',
  'space-after-function-name': 'off',
  'space-after-keywords': 'off',
  'space-before-blocks': 'off',
  'space-before-function-paren': 'off',
  'space-before-function-parentheses': 'off',
  'space-before-keywords': 'off',
  'space-in-brackets': 'off',
  'space-in-parens': 'off',
  'space-infix-ops': 'off',
  'space-return-throw-case': 'off',
  'space-unary-ops': 'off',
  'space-unary-word-ops': 'off',
  'switch-colon-spacing': 'off',
  'template-curly-spacing': 'off',
  'template-tag-spacing': 'off',
  'unicode-bom': 'off',
  'wrap-iife': 'off',
  'wrap-regex': 'off',
  'yield-star-spacing': 'off'
}

const rules = Object.assign(
  {},
  defaultFixable,
  warnThem,
  eslintConfigPrettier
)

module.exports = {
  root: true,
  env: {
    commonjs: true,
    browser: true,
    es6: true
  },
  extends: [
    'eslint:recommended',
    // 'plugin:node/recommended',
    'plugin:import/errors',
    'plugin:prettier/recommended',
    'plugin:vue/essential'
  ],
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  rules: rules
}
