const { Message, Conversation } = require('../models/Message');
const User = require('../models/User');

// @desc    Get user's conversations
// @route   GET /api/messages/conversations
// @access  Private
exports.getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id,
      isActive: true
    })
      .populate('participants', 'firstName lastName avatar')
      .populate('listing', 'title photos')
      .sort('-updatedAt');

    res.status(200).json({
      success: true,
      count: conversations.length,
      data: conversations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des conversations',
      error: error.message
    });
  }
};

// @desc    Get messages in a conversation
// @route   GET /api/messages/conversations/:conversationId
// @access  Private
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const conversation = await Conversation.findById(conversationId);
    
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation non trouvée'
      });
    }

    // Check if user is a participant
    if (!conversation.participants.includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à voir cette conversation'
      });
    }

    const skip = (Number(page) - 1) * Number(limit);

    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'firstName lastName avatar')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit));

    // Mark messages as read
    await Message.updateMany(
      { 
        conversation: conversationId,
        'readBy.user': { $ne: req.user.id }
      },
      { 
        $push: { readBy: { user: req.user.id, readAt: new Date() } }
      }
    );

    // Reset unread count for this user
    conversation.unreadCount.set(req.user.id.toString(), 0);
    await conversation.save();

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages.reverse()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des messages',
      error: error.message
    });
  }
};

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { recipientId, listingId, content, attachments } = req.body;

    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user.id, recipientId] },
      listing: listingId
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user.id, recipientId],
        listing: listingId
      });
    }

    // Create message
    const message = await Message.create({
      conversation: conversation._id,
      sender: req.user.id,
      content,
      attachments
    });

    // Update conversation
    conversation.lastMessage = {
      content,
      sender: req.user.id,
      sentAt: new Date()
    };

    // Increment unread count for recipient
    const currentUnread = conversation.unreadCount.get(recipientId.toString()) || 0;
    conversation.unreadCount.set(recipientId.toString(), currentUnread + 1);
    
    await conversation.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'firstName lastName avatar');

    res.status(201).json({
      success: true,
      data: populatedMessage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi du message',
      error: error.message
    });
  }
};

// @desc    Start a conversation with listing owner
// @route   POST /api/messages/start-conversation
// @access  Private
exports.startConversation = async (req, res) => {
  try {
    const { listingId, message } = req.body;

    const Listing = require('../models/Listing');
    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Annonce non trouvée'
      });
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user.id, listing.owner] },
      listing: listingId
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user.id, listing.owner],
        listing: listingId
      });
    }

    // Create initial message
    const newMessage = await Message.create({
      conversation: conversation._id,
      sender: req.user.id,
      content: message
    });

    // Update conversation
    conversation.lastMessage = {
      content: message,
      sender: req.user.id,
      sentAt: new Date()
    };
    
    const currentUnread = conversation.unreadCount.get(listing.owner.toString()) || 0;
    conversation.unreadCount.set(listing.owner.toString(), currentUnread + 1);
    
    await conversation.save();

    const populatedConversation = await Conversation.findById(conversation._id)
      .populate('participants', 'firstName lastName avatar')
      .populate('listing', 'title photos');

    res.status(201).json({
      success: true,
      data: {
        conversation: populatedConversation,
        message: newMessage
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors du démarrage de la conversation',
      error: error.message
    });
  }
};

// @desc    Get unread messages count
// @route   GET /api/messages/unread-count
// @access  Private
exports.getUnreadCount = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id
    });

    let totalUnread = 0;
    conversations.forEach(conv => {
      totalUnread += conv.unreadCount.get(req.user.id.toString()) || 0;
    });

    res.status(200).json({
      success: true,
      unreadCount: totalUnread
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du compteur',
      error: error.message
    });
  }
};
