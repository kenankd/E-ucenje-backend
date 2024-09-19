import express from 'express'

import materialController from '../controller/material.controller.js'

const router = express.Router()

router.get('/:id/file', materialController.getFile);
router.post('/', materialController.create);
router.delete('/:id', materialController.deleteMaterial);	
export default router