const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Definisi konfigurasi Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Fashion Store API',
      version: '1.0.0',
      description: 'API documentation for the Fashion Store application',
      contact: {
        name: 'Support Team',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:' + process.env.PORT,
      },
    ],
  },
  apis: ['./routes/*.js'], // Lokasi file route untuk membaca anotasi
};

// Inisialisasi Swagger
const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = {
  swaggerUi,
  swaggerDocs,
};