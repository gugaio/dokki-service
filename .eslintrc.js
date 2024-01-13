module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
    'es2021': true,
  },
  'extends': 'google',
  'overrides': [
    {
      'env': {
        'node': true,
      },
      'files': [
        '.eslintrc.{js,cjs}',
      ],
      'parserOptions': {
        'sourceType': 'script',
      },
    },
  ],
  'parserOptions': {
    'ecmaVersion': 'latest',
  },
  'rules': {
    'require-jsdoc': 0,
    'comma-dangle': 0,
    'padded-blocks': 0,
    'max-len': 0,
    'semi': 0,
    'no-tabs': 0,
    'indent': 0,
    'new-cap': 0,
    'arrow-parens': 0,
    'eol-last': 0,
    'object-curly-spacing': 0,
  },
};
