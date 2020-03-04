import express, { Application} from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import routesV1 from './routes/v1';

dotenv.config();

declare global{
  namespace Express{
    export interface Request{
      sessionData:any;
    }
  }
}

const app: Application = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

routesV1(app);

const PORT: number | string = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGO!, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Conected to mongodb');
    app.listen(PORT, () => {
      console.log(`Running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.log('mongodb error ', error);
  });
