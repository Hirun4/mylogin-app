import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
const app = express();


/*midddlewares*/
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by'); //less hackers know about our stack

const port = 8080;

/*HTTP get request*/
app.get('/', (req,res) => {
    res.status(201).json("Home Get Request");
});

/*server start*/
app.listen(port,() => {
    console.log(`server connected to http://localhost:${port}`);
})
