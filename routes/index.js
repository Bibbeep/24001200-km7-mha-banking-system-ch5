const express = require('express');
const router = express.Router();

const usersRoutes = require('./users');
const accountsRoutes = require('./accounts');
const transactionsRoutes = require('./transactions');
const authRoutes = require('./auth');

router.use('/api/v1/users', usersRoutes);
router.use('/api/v1/accounts', accountsRoutes);
router.use('/api/v1/transactions', transactionsRoutes);
router.use('/api/v1/auth', authRoutes);

module.exports = router;