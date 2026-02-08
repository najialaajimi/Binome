const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const {
  register,
  login,
  getMe,
  updateProfile,
  updatePassword,
  forgotPassword
} = require('../controllers/authController');

// Validation rules
const registerValidation = [
  body('firstName').trim().notEmpty().withMessage('Le prénom est requis'),
  body('lastName').trim().notEmpty().withMessage('Le nom est requis'),
  body('email').isEmail().withMessage('Email invalide'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('role').optional().isIn(['tenant', 'owner']).withMessage('Rôle invalide')
];

const loginValidation = [
  body('email').isEmail().withMessage('Email invalide'),
  body('password').notEmpty().withMessage('Le mot de passe est requis')
];

// Routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);
router.post('/forgot-password', forgotPassword);

module.exports = router;
