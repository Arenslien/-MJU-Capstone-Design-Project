module.exports = {
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "env": {
        "browser": true,
        "node": true,
        "commonjs": true,
        "es6": true,
    },
    "extends": "eslint:recommended",
    "overrides": [
        {
            "env": {
                "node": true,
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "plugins": [
        "vue"
    ],
    "rules": {
    }
}
