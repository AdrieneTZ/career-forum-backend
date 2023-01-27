const express = require('express')
const router = express.Router()
const answerController = require('../../controllers/answer-controller')

router.get('/:id', answerController.getAnswer)

module.exports = router
