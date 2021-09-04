import { createServer } from "http";
import next from "next";
import path from "path";
import { parse } from "url";
import * as config from "../config";
import { getLogger } from "./logger";

const dir = path.resolve(".", "resources", "altvrp");
const app = next({ dir, customServer: true, quiet: true });

const handle = app.getRequestHandler();
const logger = getLogger("altvrp:api");

const port = config.WEBSERVER_ADDRESS.split(":").pop();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  }).listen(port, () => {
    logger.info(`Next.js server ready on ${config.WEBSERVER_ADDRESS}`);
  });
});

export default app;
