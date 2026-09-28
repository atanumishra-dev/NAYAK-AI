require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const healthRoutes = require('./routes/health');
const locationRoutes = require('./routes/locations');
const businessRoutes = require('./routes/businesses');
const financeRoutes = require('./routes/finance');
const schemeRoutes = require('./routes/schemes');
const advisoryRoutes = require('./routes/advisory');

// Connect to MongoDB only if not in test env
if (process.env.NODE_ENV !== 'test') {
    connectDB();
}

const app = express();

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173']
}));
app.use(express.json());

// Swagger Config
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'GramVenture AI Backend API',
      version: '1.0.0',
      description: 'API documentation for GramVenture AI SIH 2026 Prototype',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api', healthRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/advisory', advisoryRoutes);

const PORT = process.env.PORT || 5000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
