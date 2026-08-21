const express = require('express');
const router = express.Router();
const runController = require('../controllers/runController');
const reliabilityController = require('../controllers/reliabilityController');

router.get('/', runController.getRuns);
router.get('/:id', runController.getRunById);
router.post('/', runController.executeRun);
router.post('/:id/rerun', reliabilityController.rerunTest);

module.exports = router;

