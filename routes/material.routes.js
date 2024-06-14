import express from 'express'

import materialController from '../controller/material.controller.js'

const router = express.Router()

router.get('/:id/file', materialController.getFile);

export default router