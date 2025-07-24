const express = require('express');
const router = express.Router();
const {getUsers, getUserById, addUser} = require('../controllers/demoController');

const upload = require('../middelware/upload');

router.get('/demo', getUsers);
router.get('/demo/:id', getUserById);
router.post('/demo', upload.single('profile'), addUser);

module.exports = router;