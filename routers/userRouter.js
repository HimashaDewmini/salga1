const express = require('express');
const router = express.Router();
const upload = require('../middelware/upload');

const {
    getUsers,
    addUser,
    getUserById,
    getUserByEmail,
    updateUser,
    createAddress,
    updateAddress,
    deleteAddress,
 
    
} = require('../controllers/userContoller');

router.get('/user', getUsers);
router.post('/user', upload.single('file'), addUser);
router.get('/user/:id', getUserById);
router.get('/user/email/:email', getUserByEmail);
router.put('/user/:id', upload.single('file'), updateUser);

// user address
router.post('/user/address/:id',createAddress);
router.put('/user/address/:addressId',updateAddress);
router.delete('/user/address/:addressId',deleteAddress)
module.exports = router;