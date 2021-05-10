const express = require('express');

const router = express.Router();
const {catchErrors} = require('../errorHandlers');

const {
  captureScreen,
} = require('../controllers/captureScreen/captureScreenController');

router.post('/', catchErrors(captureScreen));

module.exports = router;
