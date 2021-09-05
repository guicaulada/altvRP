import { config } from "@server";
import express from "express";
import { getLogger } from "./logger";

const logger = getLogger("altvrp:api");
const api = express();

logger.info("Starting API server on port", config.SERVER_API_PORT);
api.listen(config.SERVER_API_PORT);

export default api;
