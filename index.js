import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import db from './config/db.js'
import authRoutes from './routes/auth.routes.js'
import quizRoutes from './routes/quiz.routes.js'
import courseRoutes from './routes/course.routes.js'
import materialRoutes from './routes/material.routes.js'

const PORT = process.env.PORT || 3000;
const app = express()

db.sequelize.sync()
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use('/quiz', quizRoutes);
app.use('/course', courseRoutes);
app.use('/material', materialRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
