require('dotenv').config();
module.exports = {
  overrides: [{
    test: [
      './src/client',
      './src/**/*.d.ts',
      './src/plugins/**/client/**/*.ts',
      './src/plugins/**/client.ts',
    ],
    presets: [
      "@babel/preset-flow",
      "@babel/preset-typescript",
    ],
    plugins: [
      "transform-inline-environment-variables",
      ["babel-plugin-module-resolver", {
        alias: {
          "@server": "./src/server",
          "@client": "./src/client",
          "@plugins": "./src/plugins",
          "@pages": "./src/pages"
        }
      }]
    ]
  }, {
    test: [
      './src/server',
      './src/**/*.d.ts',
      './src/plugins/**/server/**/*.ts',
      './src/plugins/**/server.ts',
    ],
    presets: [
      "@babel/preset-flow",
      "@babel/preset-typescript",
    ],
    plugins: [
      "transform-inline-environment-variables",
      "@babel/plugin-transform-modules-commonjs"
    ]
  }, {
    test: [
      './src/pages',
    ],
    presets: [
      "next/babel",
    ]
  }],
};
