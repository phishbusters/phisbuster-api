import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import cors from 'cors';
import { routes } from './routes';
import { envPrivateVars } from './config/env-vars';

const {
  apiPort,
  mongoDb: {
    user: mongoDbUser,
    password: mongoDbPassword,
    host: mongoDbHost,
    port: mongoDbPort,
    database: mongoDbDatabaseName,
  },
} = envPrivateVars;

mongoose
  .connect(`${mongoDbHost}:${mongoDbPort}`, {
    user: mongoDbUser,
    pass: mongoDbPassword,
    dbName: mongoDbDatabaseName,
    connectTimeoutMS: 1000,
  })
  .then(() => {})
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(cookieParser());
const corsOptions = {
  origin: '*',
  // credentials: true,
};
app.use(cors(corsOptions));
// app.use(csurf());
app.use(bodyParser.json());

routes.forEach((route) => {
  app.use(route.route, route.controller);
});

app.listen(apiPort, () => {
  console.log(`Server is running at http://localhost:${apiPort}`);
});
