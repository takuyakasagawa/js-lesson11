module.exports = {
    "env": {
        "browser": true,
        "es6": true 
    },
    "parser": "babel-eslint",
    "root": true,
    "parserOptions": {
      "ecmaVersion": 7,
      "sourceType": "module",
        "ecmaFeatures": {
            "impliedStrict": true
        }
    },
    "rules": {
        "semi": ["error", "always"],
        "quotes": ["error", "single"],
        "no-unused-vars": "off",
    }
  };