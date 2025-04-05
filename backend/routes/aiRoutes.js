const express = require('express');
const router = express.Router();
const { generateAIResponse } = require('../controllers/AIController');

router.post('/chat', generateAIResponse);

module.exports = router;
