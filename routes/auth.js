const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth');
const passport = require('../lib/passport');

router.post('/register', register);
router.post('/login', login);
router.get('/authenticate', passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.status(200).json({
        status: 'Success',
        message: 'Successfully authenticated',
        data: {
            ...req.user
        }
    });
});

module.exports = router;