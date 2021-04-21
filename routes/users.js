const router = require('express').Router();
const { getUser, updateProfile } = require('../controllers/users');

router.get('/users/me', getUser);
router.patch('/users/me', updateProfile);

module.exports = router;
