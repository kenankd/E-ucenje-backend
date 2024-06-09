import express from 'express'

import quizController from '../controller/quiz.controller.js'

const router = express.Router()

router.get('/:courseId', quizController.getCourseQuizzes);
router.get('/:id/content', quizController.getQuizContent);
router.get('/:id/user/:userId/review', quizController.getQuizReview);
export default router;
