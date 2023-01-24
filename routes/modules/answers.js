const express = require('express')
const router = express.Router()
const answerController = require('../../controllers/answer-controller')

router.get('/:id', answerController.getAnswer)
router.put('/:id', answerController.putAnswer)
router.delete('/:id', answerController.deleteAnswer)

module.exports = router
