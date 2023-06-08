module.exports = {
  root: true,
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
   'prettier/prettier': 'off',
    // allow async-await
    'generator-star-spacing': 'off',
    // allow //debugger during development
    'no-//debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/no-parsing-error': [2, {
      'x-invalid-end-tag': false
    }],
    'no-undef': 'off',
    'camelcase': 'off',
    'semi': 'off',
    'indent':0,
    'comma-dangle':0,
    'no-trailing-spaces':0,
    'eol-last':0,
    'quotes':'off',
    'space-before-function-paren': 0
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
