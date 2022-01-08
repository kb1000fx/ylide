module.exports = {
    env: {
        es2021: true,
        node: true,
    },
    extends: [
        "airbnb-base",
        "plugin:import/typescript",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 12,
        sourceType: "module",
    },
    plugins: [
        "@typescript-eslint",
    ],
    rules: {
        "indent": ["warn", 4],
        "quotes": ["error", "double"],
        "no-console": "off",
        "no-await-in-loop": "off",
        "import/extensions": [
            "error",
            "ignorePackages",
            {
              "js": "never",
              "jsx": "never",
              "ts": "never",
              "tsx": "never"
            }
        ],
        "no-restricted-syntax": "off",
        "prefer-destructuring": ["error", {"object": true, "array": false}],
        "max-classes-per-file": "off",
        "max-len": ["error", { "code": 200, "ignoreStrings": true }],
        "class-methods-use-this": "off",
        "no-continue": "off",
    },   
    settings: {
        "import/resolver": {
            "node": {
                "extensions": [".js", ".jsx", ".ts", ".tsx"]
            }
        }
    },
};
/*
module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "airbnb-base"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": 13,
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
    }
};
*/