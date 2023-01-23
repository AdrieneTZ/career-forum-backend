const express = require('express')
const router = express.Router()
const questionController = require('../../controllers/question-controller')

router.get('/:id/answers', questionController.getQuestionAnswers)
router.get('/:id', questionController.getQuestion)
router.put('/:id', questionController.putQuestion)
router.delete('/:id', questionController.deleteQuestion)
router.post('/', questionController.postQuestion)
router.get('/', questionController.getQuestions)

module.exports = router