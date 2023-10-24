module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    tsconfigRootDir: __dirname, 
    sourceType: "module"
  },
  plugins: [
    "@typescript-eslint",
    "no-loops",
    "prettier"
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    // { off: 0, warn: 1, error: 2 }
    "no-loops/no-loops": 2,
    'prettier/prettier': [
      'error',
      {
        'endOfLine': 'auto',
      }
    ]
  }
}