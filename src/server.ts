import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import csurf from 'csurf';
import { expressjwt } from 'express-jwt';
import { routes } from './routes';

mongoose
  .connect('mongodb://localhost:27017', {
    user: 'root',
    pass: 'pass',
    dbName: 'mydb',
    connectTimeoutMS: 1000,
  })
  .then(() => {})
  .catch((err) => {
    console.log(err);
  });

const app = express();
const port = 3000;

app.use(csurf());
app.use(bodyParser.json());
app.use(
  expressjwt({ secret: 'your-secret-key', algorithms: ['HS256'] }).unless({
    path: ['/user/login', '/user/register'],
  }),
);

routes.forEach((route) => {
  app.use(route.route, route.controller);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
