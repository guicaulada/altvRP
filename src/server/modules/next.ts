// server.js
import { createServer } from "http";
import next from "next";
import path from "path";
import { parse } from "url";
import { getLogger } from "../../shared/modules/logger";

const dir = path.resolve(".", "resources", "altvrp");
const app = next({ dir });

const handle = app.getRequestHandler();
const logger = getLogger("altvrp:api");

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  }).listen(7789, () => {
    logger.info("Next.js server ready on 0.0.0.0:7789");
  });
});
