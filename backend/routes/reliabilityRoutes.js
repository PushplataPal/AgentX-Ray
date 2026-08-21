const express = require('express');
const router = express.Router();
const reliabilityController = require('../controllers/reliabilityController');

router.post('/calculate', reliabilityController.calculateReliability);
router.get('/:agentId', reliabilityController.getAgentReliability);
router.post('/runs/:id/rerun', reliabilityController.rerunTest);

module.exports = router;
