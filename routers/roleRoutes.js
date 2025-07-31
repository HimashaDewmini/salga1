const express = require('express');
const router = express.Router();
const upload = require('../middelware/upload');

const {
   getAllRoles,
   getRoleById,
   createRole,
   updateRole
} = require('../controllers/roleController');

router.get('/roles', getAllRoles);
router.get('/roles/:id', getRoleById);
router.post('/roles', upload.single('file'), createRole);
router.put('/roles/:id', upload.single('file'), updateRole);

module.exports = router;