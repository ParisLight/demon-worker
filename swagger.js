import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API',
      version: '1.0.0',
    },
  },
  apis: [
    './routes/*.js',
    './swaggerDocs/*.js'
  ]
}

export const spec = swaggerJSDoc(options);
