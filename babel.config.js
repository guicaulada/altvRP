module.exports = {
  presets: [
    "@babel/preset-typescript",
    require.resolve('next/babel')
  ],
  plugins: [
    [
      "transform-inline-environment-variables",
      {
        include: [
          "ALTV_APP_CLIENT"
        ]
      }
    ]
  ]
};
