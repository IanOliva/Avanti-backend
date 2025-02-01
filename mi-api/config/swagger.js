import swaggerUi from "swagger-ui-express";

import fs from "fs";

const swaggerDocument = JSON.parse(fs.readFileSync("./swagger_output.json", "utf-8"));

const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};

export default setupSwagger;



