const express = require('express');
const router = express.Router();
const scenarioController = require('../controllers/scenarioController');

router.get('/', scenarioController.getScenarios);
router.get('/:id', scenarioController.getScenarioById);
router.post('/generate', scenarioController.generateScenarios);
router.post('/', scenarioController.createScenario);

module.exports = router;
