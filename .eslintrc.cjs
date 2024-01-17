module.exports = {
    extends: ['airbnb', 'airbnb/hooks', 'airbnb-typescript', 'eslint:recommended', 'plugin:@typescript-eslint/recommended', 'next'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    root: true,
    ignorePatterns: ['**/tests/__mocks__/**/*'],
    rules: {
        '@next/next/no-img-element': 'off',
        'react/require-default-props': 'off',
        'max-len': 'off',
        'react/function-component-definition': ['error', {'namedComponents': 'arrow-function'}],
        'radix': ['error', 'as-needed'],
        'no-underscore-dangle': 'off',
        'import/no-extraneous-dependencies': ['error', {'devDependencies': true}],
        'no-restricted-syntax': 'off',
        'no-param-reassign': 'off',
        'prefer-destructuring': ['error', {'AssignmentExpression': {'array': false, 'object': false}}],
        'no-mixed-operators': 'off',
        'max-classes-per-file': ['error', 3],
        'no-bitwise': 'off',
        'no-plusplus': ['error', {'allowForLoopAfterthoughts': true}],
        'no-continue': 'off',
        'react/jsx-props-no-spreading': ['error', {'custom': 'ignore'}],
        'import/no-named-as-default': 'off',
        'react/no-unstable-nested-components': ['error', {'allowAsProps': true}],
        'no-console': 'off'
    },
    parserOptions: {
        project: './tsconfig.json'
    }
};
