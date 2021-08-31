import express from "express";
import { getLogger } from "../../shared/modules/logger";
import login from "./login";
import view from "./view";

const logger = getLogger("altvrp:api");
const app = express();

app.use(login);
app.use(view);

logger.info("Starting API server on 0.0.0.0:7789");
app.listen(7789);
