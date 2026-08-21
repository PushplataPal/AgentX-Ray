const express = require('express');
const router = express.Router();
const failureController = require('../controllers/failureController');

router.get('/', failureController.getFailures);
router.get('/fingerprint/:agentId', failureController.getFailureFingerprint);

module.exports = router;
