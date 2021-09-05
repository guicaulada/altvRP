import * as alt from "alt-server";
import { createServer } from "http";
import next from "next";
import path from "path";
import { parse } from "url";
import * as config from "../config";
import { getLogger } from "./logger";

const dir = path.resolve(".", "resources", alt.resourceName, "views");
const app = next({ dir, customServer: true, quiet: true });

if (config.LOCAL_VIEWS) {
  const handle = app.getRequestHandler();
  const logger = getLogger("altvrp:views");

  const port = config.VIEWS_URL.split(":").pop();

  app.prepare().then(() => {
    createServer((req, res) => {
      const parsedUrl = parse(req.url!, true);
      handle(req, res, parsedUrl);
    }).listen(port, () => {
      logger.info(`Views server ready on`, config.VIEWS_URL);
    });
  });
}

export default app;
