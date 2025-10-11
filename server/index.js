import express from "express";
import 'dotenv/config';
import connectDB from './db.js';
// Updated import extensions
import { registerRoutes } from "./routes.js";
import { setupVite, serveStatic, log } from "./vite.js";
import { seedMemoryStorage } from "./seedMemory.js";

connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine, "access");
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // await seedMemoryStorage();

  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    if (app.get("env") === "development") {
        throw err;
    }
  });

  // Setup Vite for development or serve static files for production
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }


  const port = parseInt(process.env.PORT || '3000', 10);
  server.listen({
    port,
    host: "127.0.0.1", // Changed from "0.0.0.0"
    // removed: reusePort: true
  }, () => {
    log(`serving on http://127.0.0.1:${port}`, "server");
  });
})();
