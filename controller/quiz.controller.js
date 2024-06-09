import db from '../config/db.js';

const getCourseQuizzes = async (req, res) => {
    try {
        const CourseId = req.params.courseId;
        const quizzes = await db.Quiz.findAll({ where: { CourseId } });
        res.status(200).send(quizzes);
    } catch (error) {
        res.status(400).send(error);
    }
}

const getQuizContent = async (req, res) => {
    try {
        const id = req.params.id;
        const quiz = await db.Quiz.findByPk(id, {
            include: [{
                model: db.Question, include: db.Answer
            }],
        });
        res.status(200).send(quiz);
    } catch (error) {
        res.status(400).json(error);
    }
}

const quizController = {
    getCourseQuizzes,
    getQuizContent
};

export default quizController;
