import express from 'express'
import bodyParser from 'body-parser'

import db from './config/db.js'
import authRoutes from './routes/auth.routes.js'
import quizRoutes from './routes/quiz.routes.js'

const PORT = process.env.PORT || 3000;
const app = express()

db.sequelize.sync()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use('/quiz', quizRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
