import Sequelize from 'sequelize'
import mysql2 from 'mysql2'

import User from '../model/User.model.js'
import Quiz from '../model/Quiz.model.js'

const sequelize = new Sequelize("db_aa8733_eucenje", "aa8733_eucenje", "Chicago.1",
    { host: "mysql6008.site4now.net", dialect: "mysql", dialectModule: mysql2, logging: false }
);

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

Sequelize.

db.user = User(sequelize, Sequelize);
db.quiz = Quiz(sequelize, Sequelize);

export default db;