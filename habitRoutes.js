const express = require('express');
const router = express.Router();
const habitController = require('../controllers/habitController');

router.post('/habits', habitController.addHabit);
router.put('/habits/:id', habitController.updateHabit);
router.get('/habits', habitController.getHabits);
router.get('/habits/report', habitController.getWeeklyReport);

module.exports = router;
