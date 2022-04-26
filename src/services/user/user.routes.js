const router = require('express').Router();

const { authN } = require('../../middelwares/authN');
const { isAdmin, myProfile } = require('../../middelwares/authZ');
const { imageUpload } = require('../../config/multer');
const { logUser, regUser, logout } = require('./login.controller');
const { getUsers, getUser, addUser, updateUser, deleteUser } = require('./user.controller');

//Login
router.post('/login', logUser);
router.post('/signup', imageUpload.single('photo'), regUser);
router.post('/logout', logout);

//Admin
router.get('/users', getUsers);
router.get('/user/:id', authN, isAdmin, getUser);
router.post('/user', authN, isAdmin, imageUpload.single('photo'), addUser);
router.put('/user/:id', authN, isAdmin, imageUpload.single('photo'), updateUser);
router.delete('/user/:id', authN, isAdmin, deleteUser);

// router.get('/users', getUsers);
// router.post('/user', imageUpload.single('photo'), addUser);
// router.put('/user/:id',  imageUpload.single('photo'), updateUser);
// router.delete('/user/:id',  deleteUser);


//Authors Users
router.get('/profile/:id', authN, myProfile, getUser);
router.put('/profile/:id', authN, myProfile, imageUpload.single('photo'), updateUser);
router.delete('/profile/:id', authN, myProfile, deleteUser);

//Ordinary Users
// router.get('/authors', )

module.exports = router;
