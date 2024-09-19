import express from 'express'

import quizController from '../controller/quiz.controller.js'

const router = express.Router()

router.get('/:courseId', quizController.getCourseQuizzes);
router.get('/:id/content', quizController.getQuizContent);
router.get('/:id/user/:userId/review', quizController.getQuizReview);

router.post('/:id/user/:userId/submit', quizController.submitQuiz);
router.post('/', quizController.createQuiz);

router.delete('/:id', quizController.deleteQuiz);

export default router;
