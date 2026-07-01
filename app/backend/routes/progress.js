const express = require('express');
const router = express.Router();
const {
  getSurahs,
  getStudentByEmail,
  createStudent,
  getStudentProgress,
  updateStudentProgress,
} = require('../controllers/progressController');

router.get('/surahs', getSurahs);
router.post('/students', createStudent);
router.get('/students/by-email/:email', getStudentByEmail);
router.get('/students/:id/progress', getStudentProgress);
router.post('/students/:id/progress', updateStudentProgress);

module.exports = router;
