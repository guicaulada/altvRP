import express from "express";
import path from "path";

const router = express.Router();
const staticPath = path.resolve(".", "resources", "altvrp", "dist", "view");

router.use("/", express.static(staticPath));

router.use("/", (_req, res, _next) => {
  res.sendFile(path.join(staticPath, "index.html"));
});

export default router;
