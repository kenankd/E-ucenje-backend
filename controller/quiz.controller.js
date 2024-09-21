import db from '../config/db.js';
import { Op } from 'sequelize';

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

        const questions = await db.Question.findAll({
            where: { QuizId: id },
            attributes: ['points']
        });
        let maxScore = 0;
        for (const question of questions) {
            maxScore += question.dataValues.points;
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

        const quizReview = quiz.Questions.map((question) => {
            const userAnswer = quizAttempt.UserQuizAnswers.find(
                (ua) => ua.Question.id === question.id
            );
            return {
                id: question.id,
                question: question.text,
                points: question.points,
                answers: question.Answers.map((answer) => ({
                    id: answer.id,
                    text: answer.text,
                    isCorrect: answer.correct,
                    isSelected: userAnswer.Answer.id === answer.id,
                })),
            };
        });
        let state = "Failed"
        if (quizAttempt.score / maxScore >= 0.5) {
            state = "Passed"
        }

        //STATISTICS ABOUT MATERIALS RELATED TO QUESTIONS
        //console.log(quizReview)
        let statistics = ""

        const materialIds = quiz.Questions.map(question => question.MaterialId);
        console.log(materialIds)
        // Fetch all materials that have a matching id
        const materials = await db.Material.findAll({
            where: {
                id: {
                    [Op.in]: materialIds
                }
            }
        });
        for (const material of materials) {
            console.log(material)
        }



        res.json({
            quizName: quiz.name,
            startedOn: quizAttempt.date,
            score: quizAttempt.score,
            maxScore: maxScore,
            state,
            time: quizAttempt.time,
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
        const { answers, time } = req.body;
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
        await db.QuizAttempt.update({ score, time }, { where: { id: quizAttempt.id } });
        res.status(200).json({ message: "Quiz submitted successfully" });
    } catch (error) {
        console.log(error)
        res.status(400).json(error);
    }
}

const createQuiz = async (req, res) => {
    const { name, time, CourseId, questions, minScore } = req.body;
    console.log(req.body.questions[0].answers);
    try {
        const quiz = await db.Quiz.create({
            name,
            time,
            minScore,
            CourseId
        });

        for (const question of questions) {
            const { text, points, answers, materialId } = question;
            const newQuestion = await db.Question.create({
                text,
                points,
                QuizId: quiz.id,
                MaterialId : materialId
            });

            for (const answer of answers) {
                const { text, correct } = answer;
                await db.Answer.create({
                    text,
                    correct,
                    QuestionId: newQuestion.id
                });
            }
        }

        res.status(201).send(quiz);
    } catch (error) {
        console.log(error);
        res.status(400).send('Error creating quiz');
    }
}

const deleteQuiz = async (req, res) => {
    try {
        const id = req.params.id;
        await db.Quiz.destroy({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(400).send(error);
    }
}

const updateQuiz = async (req, res) => {
    const id = req.params.id;
    console.log(id);
    await db.Quiz.destroy({ where: { id } });
    createQuiz(req, res);
}

const quizController = {
    getCourseQuizzes,
    getQuizContent,
    getQuizReview,
    submitQuiz,
    createQuiz,
    deleteQuiz,
    updateQuiz
};

export default quizController;
