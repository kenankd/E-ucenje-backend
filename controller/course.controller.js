import db from '../config/db.js';
import jwt from 'jsonwebtoken';
async function getCourses(req, res) {
    try {
        const courses = await db.Course.findAll();
        res.status(200).send(courses);
    } catch (error) {
        res.status(400).send(error);
    }
}

async function getCourseById(req, res) {
    try {
        const id = req.params.id;
        const course = await db.Course.findByPk(id);
        res.status(200).send(course);
    } catch (error) {
        res.status(400).send(error);
    }
}

async function getCourseMaterials(req, res) {
    try {
        const id = req.params.id;
        const course = await db.Course.findByPk(id, {
            include: db.Material
        });
        const token = req.headers.authorization.split(' ')[1];
        const user = jwt.verify(token, process.env.JWT_SECRET);
          
        const courseMaterials = course.Materials;

        const updatedCourseMaterials = await Promise.all(courseMaterials.map(async (material) => {
            const quiz = await db.Quiz.findByPk(material.QuizId);
            if (!quiz) {
                material.dataValues.passed = false;
                return material;
            }

            const userQuiz = await db.UserQuiz.findOne({ where: { UserId: user.id, QuizId: material.QuizId } });
            if (!userQuiz) {
                material.dataValues.passed = false;
                return material;
            }
        
            const quizAttempts = await db.QuizAttempt.findAll({
                where: {
                    UserQuizId: userQuiz.id,
                    score: {
                        [db.Sequelize.Op.gte]: quiz.minScore
                    }
                }
            });
        
            material.dataValues.passed = quizAttempts.length > 0;
            return material;
        }));

        res.status(200).send(updatedCourseMaterials);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}



const courseController = {
    getCourses,
    getCourseById,
    getCourseMaterials
}

export default courseController;