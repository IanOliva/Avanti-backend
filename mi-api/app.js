
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
import { fileURLToPath } from 'url';



dotenv.config();

connectDB();


import usersRouter from './routes/userRoutes.js';
import projectRouter from './routes/projectRoutes.js';
import commentsRouter from './routes/commentRoutes.js';
import contributionsRouter from './routes/contributionRoutes.js';


const app = express();

app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/user', usersRouter);
app.use('/project', projectRouter);
app.use('/comments', commentsRouter);
app.use('/contributions', contributionsRouter);

app.use(express.static('public'));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Avanti.jpg'));
});

const port =   4000;



app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

export default app;