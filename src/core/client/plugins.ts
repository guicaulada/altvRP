import { getLogger } from 'core/shared/logger';
import { Plugin } from 'core/shared/types';
import * as proxy from './proxy';
import * as alt from 'alt-client';

const logger = getLogger('altvrp:plugins');
const plugins = {} as { [key: string]: any };

proxy.client.loadPlugins = (pluginsList: Plugin[]) => {
  pluginsList.forEach((p) => {
    if (p.name[0] != '_') {
      logger.info(`Loading plugin ~y~${p.name}`);
      try {
        plugins[p.name] = import(p.path);
      } catch (err) {
        console.log(err);
        logger.error(`~r~Failed to load plugin ${p.name}`);
      }
      logger.info(`Loaded plugin ~y~${p.name}`);
    }
  });
  alt.emitServer('pluginsLoaded');
};

export default plugins;
