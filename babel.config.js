module.exports = {
  overrides: [{
    test: [
      './src/client',
    ],
    presets: [
      "@babel/preset-typescript",
    ],
    plugins: [
      ["transform-inline-environment-variables", { include: ["ALTV_APP_CLIENT"] }],
    ]
  }, {
    test: [
      './src/server',
    ],
    presets: [
      "@babel/preset-typescript",
    ],
    plugins: [
      ["@babel/plugin-transform-modules-commonjs"]
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
