import * as config from "core/config/shared";
import { getLogger } from "core/shared/logger";
import express from "express";

const logger = getLogger("altvrp:api");
const api = express();

logger.info("Starting API server on port", config.SERVER_API_PORT);
api.listen(config.SERVER_API_PORT);

export default api;
