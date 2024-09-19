import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import db from './config/db.js'
import authRoutes from './routes/auth.routes.js'
import quizRoutes from './routes/quiz.routes.js'
import courseRoutes from './routes/course.routes.js'
import materialRoutes from './routes/material.routes.js'
import session from 'express-session'
import bcrypt from 'bcrypt'

const PORT = process.env.PORT || 3000;
const app = express()

db.sequelize.sync()
app.use(cors())
// Increase payload size limit
app.use(bodyParser.json({ limit: '50mb' }));  // Increase limit to 50 MB
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: "secret",
    cookie: { secure: false }
}));
app.use('/auth', authRoutes);
app.use('/quiz', quizRoutes);
app.use('/course', courseRoutes);
app.use('/material', materialRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
