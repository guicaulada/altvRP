import dotenv from "dotenv";

dotenv.config()

export default {
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
        "@shared": "./src/shared",
        "@pages": "./src/pages"
      }
    }]
  ]
};
