module.exports = {
  overrides: [{
    test: [
      './src/client',
      './src/plugins/**/client/**/*.ts',
      './src/plugins/**/client.ts',
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
      './src/plugins/**/server/**/*.ts',
      './src/plugins/**/server.ts',
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
