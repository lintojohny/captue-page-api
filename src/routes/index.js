const express = require('express');

const router = express.Router();
const healthRouter = require('./health');

const captureScreen = require('./capture');

router.use('/health', healthRouter);

router.use('/capture', captureScreen);

module.exports = router;
