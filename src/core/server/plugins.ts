import * as alt from 'alt-server';
import { getLogger } from 'core/shared/logger';
import { Plugin } from 'core/shared/types';
import glob from 'glob';
import path from 'path';
import * as proxy from './proxy';

const fileUrl = (str: string) => {
  let pathName = path.resolve(str).replace(/\\/g, '/');
  if (pathName[0] !== '/') {
    pathName = '/' + pathName;
  }
  return encodeURI('file://' + pathName);
};

const getPluginName = (url: string) => {
  const pluginFolder = url.split('/plugins/').pop();
  if (pluginFolder) {
    return pluginFolder.split('/').shift();
  }
  return;
};

const logger = getLogger('altvrp:plugins');
const plugins = {} as { [key: string]: any };
const pluginsPath = path.resolve('.', 'resources', alt.resourceName, 'dist', 'plugins');

const serverFiles = [...glob.sync(path.join(pluginsPath, '/*/server.js'))];

const clientFiles = [...glob.sync(path.join(pluginsPath, '/*/client.js'))];

serverFiles.forEach((file) => {
  const url = fileUrl(file);
  const name = getPluginName(url);
  if (name && name[0] != '_') {
    logger.info(`Loading plugin ~y~${name}`);
    try {
      plugins[name] = import(url);
    } catch (err) {
      console.log(err);
      logger.error(`~r~Failed to load plugin ${name}`);
    }
    logger.info(`Loaded plugin ~y~${name}`);
  }
});

alt.on('playerConnect', (player) => {
  proxy.client.loadPlugins(
    player,
    clientFiles
      .map((file) => {
        const relativePath = file.split('/plugins/').pop();
        if (relativePath) {
          const name = relativePath.split('/').shift();
          if (name) {
            return { name, path: `../../plugins/${relativePath}` };
          }
        }
        return null;
      })
      .filter((p) => p !== null) as Plugin[],
  );
});

export default plugins;
