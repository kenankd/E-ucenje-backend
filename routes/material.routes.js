import express from 'express'

import materialController from '../controller/material.controller.js'

const router = express.Router()

router.get('/:id', materialController.getFile);

export default router