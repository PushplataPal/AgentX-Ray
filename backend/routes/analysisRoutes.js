const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');

router.post('/analyze', analysisController.analyzeExecution);
router.post('/autopsy', analysisController.generateAutopsy);

module.exports = router;
