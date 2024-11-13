import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
const app = express();


/*midddlewares*/
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by'); //less hackers know about our stack
