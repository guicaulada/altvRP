import * as alt from 'alt-server';
import server from 'core/config/server';
import shared from 'core/config/shared';
import { getLogger } from 'core/shared/logger';
import { createServer } from 'http';
import next from 'next';
import path from 'path';
import { parse } from 'url';

const dir = path.resolve('.', 'resources', alt.resourceName, 'views');
const app = next({ dir, customServer: true, quiet: true });

if (server.LOCAL_VIEWS) {
  const handle = app.getRequestHandler();
  const logger = getLogger('altvrp:views');

  const port = shared.VIEWS_URL.split(':').pop();

  app.prepare().then(() => {
    createServer((req, res) => {
      if (req.url) {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
      }
    }).listen(port, () => {
      logger.info(`Views server ready on`, shared.VIEWS_URL);
    });
  });
}

export default app;
