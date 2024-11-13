import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
const app = express();


/*midddlewares*/
app.use(express.json());
app.use(cors());