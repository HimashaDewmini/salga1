const express = require('express');
const router = express.Router();
const upload = require('../middelware/upload');

const {
   getAllRoles,
} = require('../controllers/roleController');                  

router.get('/roles', getAllRoles);

module.exports = router;