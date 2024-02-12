import "dotenv/config";
import "reflect-metadata";
import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";
import error from "./middlewares/error";
import { RegisterRoutes } from "./routes";

async function main() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/", express.static("static"));
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  RegisterRoutes(app);

  app.use(error);

  const APP_HOST = process.env.APP_HOST || "0.0.0.0";
  const APP_PORT = +(process.env.APP_PORT || 3000);

  app.listen(APP_PORT, APP_HOST, () =>
    console.log(`Listening on: http://localhost:${APP_PORT}`),
  );
}

main();
