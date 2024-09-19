import express from 'express'

import courseController from '../controller/course.controller.js'

const router = express.Router()

router.get('/', courseController.getCourses);
router.get('/:id', courseController.getCourseById);
router.get('/:id/materials', courseController.getCourseMaterials);

router.post('/', courseController.createCourse);

export default router;