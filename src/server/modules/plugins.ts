import alt from "alt-server";
import glob from "glob";
import path from "path";
import { getLogger } from "./logger";
import * as proxy from "./proxy";

const fileUrl = (str: string) => {
  var pathName = path.resolve(str).replace(/\\/g, "/");
  if (pathName[0] !== "/") {
    pathName = "/" + pathName;
  }
  return encodeURI("file://" + pathName);
};

const logger = getLogger("altvrp:plugins");
const plugins = {} as { [key: string]: any };
const pluginsPath = path.resolve(".", "resources", "altvrp", "dist", "plugins");

const serverFiles = [
  ...glob.sync(path.join(pluginsPath, "/**/server/**/*.js")),
  ...glob.sync(path.join(pluginsPath, "/**/server.js")),
];

const clientFiles = [
  ...glob.sync(path.join(pluginsPath, "/**/client/**/*.js")),
  ...glob.sync(path.join(pluginsPath, "/**/client.js")),
];

serverFiles.forEach((file) => {
  const url = fileUrl(file);
  const name = url.split("/plugins/").pop()!.split("/").shift()!;
  logger.info(`Loading plugin ~y~${name}`);
  try {
    plugins[name] = import(url);
  } catch (err) {
    console.log(err);
    logger.error(`~r~Failed to load plugin ${name}`);
  }
  logger.info(`Loaded plugin ~y~${name}`);
});

alt.on("playerConnect", (player) => {
  proxy.client.loadPlugins(
    player,
    clientFiles.map((file) => {
      const relativePath = file.split("/plugins/").pop()!;
      const name = relativePath.split("/").shift()!;
      return { name, path: `../../plugins/${relativePath}` };
    })
  );
});

export default plugins;
