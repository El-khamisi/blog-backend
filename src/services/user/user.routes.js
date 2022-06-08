const router = require('express').Router();

const { authN } = require('../../middelwares/authN');
const { isAdmin, myProfile } = require('../../middelwares/authZ');
const { imageUpload } = require('../../config/multer');
const { logUser, regUser, logout } = require('./login.controller');
const { getUsers, getUser, addUser, updateUser, deleteUser } = require('./user.controller');
const userModel = require('./user.model');

//Login
router.post('/login', logUser);
router.post('/signup', imageUpload.single('photo'), regUser);
router.post('/logout', logout);

//Admin
router.get('/delete', async(req, res)=>{
    try{
        const response = await userModel.updateMany({}, {is_deleted: true});
        return successfulRes(res, 200, response);
    }catch(e){
        return failedRes(res, 500, e);
    }
})
router.get('/users', getUsers);
router.get('/user/:id', getUser);
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

module.exports = router;
