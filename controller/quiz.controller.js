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

const getQuizReview = async (req, res) => {
    const id = req.params.id;
    const userId = req.params.userId;
    try {
        const userQuiz = await db.UserQuiz.findOne({
            where: { QuizId: id, UserId: userId }
        });
        const userQuizId = userQuiz.dataValues.id;
        const userAnswers = await db.UserQuiz.findByPk(userQuizId, {
            include: [{
                model: db.QuizAttempt,
                include: [{ model: db.UserQuizAnswer, include: [db.Answer, db.Question] }]
            }]
        });
        res.status(200).send(userAnswers.QuizAttempt);
    }
    catch (error) {
        res.status(400).json(error);
    }
}

const submitQuiz = async (req, res) => {
    try {
        const { id, userId } = req.params;
        const {answers} = req.body;
        
        const userQuiz = await db.UserQuiz.create({
            UserId: userId,
            QuizId: id
        });
        const userQuizId = userQuiz.dataValues.id;

        const quizAttempt = await db.QuizAttempt.create({
            date: new Date(),
            score: null,
            UserQuizId: userQuizId
        });

        let score = 0;
        for (const answer of answers) {
            await db.UserQuizAnswer.create({
                UserQuizId: userQuizId,
                QuestionId: answer.questionId,
                AnswerId: answer.id
            });
        
            const answerForQuestion = await db.Answer.findByPk(answer.id, { include: db.Question });
            if (answerForQuestion.dataValues.correct === true) {
                score += answerForQuestion.dataValues.Question.dataValues.points;
            }
        }
        await db.QuizAttempt.update({ score }, { where: { id: quizAttempt.id } });
        res.status(200).json({message: "Quiz submitted successfully"});
    } catch (error) {
        console.log(error)
        res.status(400).json(error);
    }
}

const quizController = {
    getCourseQuizzes,
    getQuizContent,
    getQuizReview,
    submitQuiz
};

export default quizController;
