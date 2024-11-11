const express = require('express');
const router = express.Router();
const officerController = require('../controllers/officerController');
const authMiddleware = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');

// All routes require authentication and officer role
router.use(authMiddleware, checkRole(['officer']));

// Patent management
router.get('/pending', officerController.getPendingPatents);
router.get('/patents', officerController.getAllPatents);
router.post('/approve/:patentId', officerController.approvePatent);
router.post('/reject/:patentId', officerController.rejectPatent);

module.exports = router;