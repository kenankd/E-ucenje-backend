import express from 'express'

import db from './config/db.js'
import authRoutes from './routes/auth.routes.js'

const PORT = process.env.PORT || 3000;
const app = express()

db.sequelize.sync()

app.use('/auth', authRoutes);



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
