import express from "express";
import swaggerUi from 'swagger-ui-express';
import { spec } from "./swagger.js";
import cors from "cors";
import demonStartRoute from './routes/demonStartRoute.js';
import testPostRoute from './routes/testPostRoute.js';
import dotenv from "dotenv";
import {
  io,
  initializeSocketHandlers
} from './utils/index.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(demonStartRoute);
app.use(testPostRoute);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));

initializeSocketHandlers(io);

app.listen(process.env.APP_PORT, () => {
  console.log(`Express server is listening on ${process.env.APP_PORT}`);
});
