module.exports = {
  presets: [
    "@babel/preset-typescript",
    "next/babel"
  ],
  plugins: [
    ["transform-inline-environment-variables", { include: ["ALTV_APP_CLIENT"] }],
    ["@babel/plugin-proposal-private-property-in-object", { loose: false }],
    ["@babel/plugin-proposal-private-methods", { loose: false }]
  ]
};
