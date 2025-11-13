import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

import userRoutes from './src/routes/user.routes.js';
import cvRoutes from './src/routes/cv.routes.js';
import conferenceRoutes from './src/routes/conference.routes.js';
import FileRoutes from './src/routes/file.routes.js';
import workshopRoutes from './src/routes/workshop.routes.js';
import EMRTrainingRoutes from './src/routes/emrTraining.routes.js';
import PublicationsRoutes from './src/routes/publication.routes.js';



// app.use('/api/files', FileRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cv', cvRoutes);
app.use('/api/conferences', conferenceRoutes);
app.use('/api/workshops', workshopRoutes);
app.use('/api/documents', FileRoutes);
app.use('/api/emr-training', EMRTrainingRoutes);
app.use('/api/publications', PublicationsRoutes);

export { app };