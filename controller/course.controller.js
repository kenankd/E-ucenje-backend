import db from '../config/db.js';

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
        res.status(200).send(course.Materials);
    } catch (error) {
        res.status(400).send(error);
    }
}



const courseController = {
    getCourses,
    getCourseById,
    getCourseMaterials
}

export default courseController;