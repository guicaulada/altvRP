import dotenv from "dotenv";

dotenv.config()

export default {
  presets: [
    "@babel/preset-typescript",
  ],
  plugins: [
    "transform-inline-environment-variables",
    ["module-resolver", {
      alias: {
        "core": "./src/core",
        "plugins": "./src/plugins"
      }
    }],
    ["module-extension-resolver", {
      srcExtensions: [".d.ts"],
      dstExtension: ".d.js"
    }]
  ]
};
