import Sequelize from 'sequelize'
import mysql2 from 'mysql2'
import dotenv from 'dotenv'

import User from '../model/User.model.js'
import Quiz from '../model/Quiz.model.js'
import Question from '../model/Question.model.js';
import Answer from '../model/Answer.model.js';
import Course from '../model/Course.model.js';
import Material from '../model/Material.model.js';
import Notification from '../model/Notification.model.js';
import UserQuiz from '../model/UserQuiz.model.js';
import QuizAttempt from '../model/QuizAttempt.model.js'
import UserQuizAnswer from '../model/UserQuizAnswer.model.js'


dotenv.config();
const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD,
    { host: DB_HOST, dialect: "mysql", dialectModule: mysql2, logging: false }
);

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = User(sequelize, Sequelize);
db.Course = Course(sequelize, Sequelize);
db.Material = Material(sequelize, Sequelize);
db.Quiz = Quiz(sequelize, Sequelize);
db.Question = Question(sequelize, Sequelize);
db.Answer = Answer(sequelize, Sequelize);
db.Notification = Notification(sequelize, Sequelize);
db.UserQuiz = UserQuiz(sequelize, Sequelize);
db.QuizAttempt = QuizAttempt(sequelize, Sequelize);
db.UserQuizAnswer = UserQuizAnswer(sequelize, Sequelize);

db.User.belongsToMany(db.Quiz, { through: db.UserQuiz });
db.Quiz.belongsToMany(db.User, { through: db.UserQuiz });

db.User.hasMany(db.Notification);
db.Notification.belongsTo(db.User);

db.Quiz.hasMany(db.Question);
db.Question.belongsTo(db.Quiz);

db.Question.hasMany(db.Answer);
db.Answer.belongsTo(db.Question);

db.Course.hasMany(db.Material);
db.Material.belongsTo(db.Course);

db.Course.hasMany(db.Quiz);
db.Quiz.belongsTo(db.Course);

db.Quiz.hasMany(db.Material);
db.Material.belongsTo(db.Quiz);

db.QuizAttempt.hasOne(db.UserQuiz);
db.UserQuiz.belongsTo(db.QuizAttempt);

db.QuizAttempt.hasMany(db.UserQuizAnswer);
db.UserQuizAnswer.belongsTo(db.QuizAttempt);

db.Answer.hasMany(db.UserQuizAnswer);
db.UserQuizAnswer.belongsTo(db.Answer);

db.Question.hasMany(db.UserQuizAnswer);
db.UserQuizAnswer.belongsTo(db.Question);

export default db;