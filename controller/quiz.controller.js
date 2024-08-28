import db from '../config/db.js';

const getCourseQuizzes = async (req, res) => {
    try {
        const CourseId = req.params.courseId;
        const userId = 1;

        const quizzes = await db.Quiz.findAll({
            where: { CourseId }
        });

        const quizzesWithScore = await Promise.all(quizzes.map(async (quiz) => {
            // Provjeri da li je korisnik pokušao kviz
            const userQuiz = await db.UserQuiz.findOne({
                where: { QuizId: quiz.id, UserId: userId }
            });

            const questions = await db.Question.findAll({
                where: { QuizId: quiz.id },
                attributes: ['points']
            });
            let maxScore = 0;
            for (const question of questions) {
                maxScore += question.dataValues.points;
            }
            quiz.dataValues.maxScore = maxScore;

            if (!userQuiz) {
                quiz.dataValues.score = null;
                console.log(quiz.dataValues)
                return quiz;
            }
            const userQuizId = userQuiz.dataValues.id;
            const attempt = await db.QuizAttempt.findOne({
                where: {
                    UserQuizId: userQuizId
                },
                attributes: ['score']
            });
            quiz.dataValues.score = attempt ? attempt.score : null;
            return quiz;
        }));

        res.status(200).send(quizzesWithScore);
    } catch (error) {
        console.error(error);
        res.status(400).send({ error: 'Greška prilikom preuzimanja kvizova za kurs.' });
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
    try {
        const { id, userId } = req.params;

        // Fetch the UserQuiz for the given user and quiz ID
        const userQuiz = await db.UserQuiz.findOne({
            where: { QuizId: id, UserId: userId }
        });

        if (!userQuiz) {
            return res.status(404).json({ message: 'Quiz not found for this user' });
        }

        // Fetch the QuizAttempt for the specific UserQuiz
        const quizAttempt = await db.QuizAttempt.findOne({
            where: { UserQuizId: userQuiz.id },
            include: [
                {
                    model: db.UserQuizAnswer,
                    include: [
                        {
                            model: db.Answer,
                            attributes: ['id', 'text', 'correct'], // Use the correct attribute name
                        },
                        {
                            model: db.Question,
                            attributes: ['id', 'text'],
                        },
                    ],
                },
            ],
        });

        if (!quizAttempt) {
            return res.status(404).json({ message: 'Quiz attempt not found' });
        }

        // Fetch the Quiz and its Questions and Answers separately
        const quiz = await db.Quiz.findOne({
            where: { id: userQuiz.QuizId },
            include: [
                {
                    model: db.Question,
                    include: [
                        {
                            model: db.Answer,
                            attributes: ['id', 'text', 'correct'],
                        },
                    ],
                },
            ],
        });

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Structure the response data
        const quizReview = quiz.Questions.map((question) => {
            const userAnswer = quizAttempt.UserQuizAnswers.find(
                (ua) => ua.Question.id === question.id
            );
            //TODO ADD correct to every question
            console.log(userAnswer)
            return {
                question: question.text,
                answers: question.Answers.map((answer) => ({
                    id: answer.id,
                    text: answer.text,
                    isCorrect: answer.correct,
                    isSelected: userAnswer.Answer.id === answer.id,
                })),
            };
        });

        res.json({
            quizName: quiz.name,
            startedOn: quizAttempt.date,
            score: quizAttempt.score,
            //fali max score i state
            review: quizReview,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


const submitQuiz = async (req, res) => {
    try {
        const { id, userId } = req.params;
        const { answers } = req.body;
        console.log(answers);
        let userQuiz = await db.UserQuiz.findOne({
            where: { UserId: userId, QuizId: id }
        });
        if (userQuiz) {
            let quizAttempt = await db.QuizAttempt.findOne({ where: { UserQuizId: userQuiz.id } });
            await db.UserQuizAnswer.destroy({ where: { QuizAttemptId: quizAttempt.id } });
            await quizAttempt.destroy();
            await userQuiz.destroy();
        }

        userQuiz = await db.UserQuiz.create({
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
            const answerForQuestion = await db.Answer.findByPk(answer.id, { include: db.Question });
            await db.UserQuizAnswer.create({
                UserQuizId: userQuizId,
                QuizAttemptId: quizAttempt.dataValues.id,
                QuestionId: answerForQuestion.dataValues.Question.dataValues.id,
                AnswerId: answer.id
            });

            if (answerForQuestion.dataValues.correct === true) {
                score += answerForQuestion.dataValues.Question.dataValues.points;
            }
        }
        await db.QuizAttempt.update({ score }, { where: { id: quizAttempt.id } });
        res.status(200).json({ message: "Quiz submitted successfully" });
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
