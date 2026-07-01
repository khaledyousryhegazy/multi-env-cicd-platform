const express = require('express');
const router = express.Router();
const { getMentorProfile } = require('../controllers/mentorController');

router.get('/', getMentorProfile);

module.exports = router;
