const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const {
  getConversations,
  getMessages,
  sendMessage,
  startConversation,
  getUnreadCount
} = require('../controllers/messageController');

// All routes are protected
router.use(protect);

// Message validation
const messageValidation = [
  body('content').trim().notEmpty().withMessage('Le message ne peut pas être vide')
];

router.get('/conversations', getConversations);
router.get('/conversations/:conversationId', getMessages);
router.post('/', messageValidation, validate, sendMessage);
router.post('/start-conversation', messageValidation, validate, startConversation);
router.get('/unread-count', getUnreadCount);

module.exports = router;
