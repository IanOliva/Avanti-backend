import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "API de Avanti",
    description: "Documentación generada automáticamente con Swagger",
    version: "1.0.0",
  },
  host: "localhost:4000", // Cambia según tu entorno
  schemes: ["http"],
};

const outputFile = "./swagger_output.json"; // Archivo de salida
const endpointsFiles = ["./app.js"]; // Archivo principal donde defines las rutas

swaggerAutogen(outputFile, endpointsFiles).then(() => {
  console.log("✅ Documentación generada automáticamente");
});
