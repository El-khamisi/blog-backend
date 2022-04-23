const router = require('express').Router();

const { authN } = require('../../middelwares/authN');
const { myWork, isAuthor, isGuest, isAdmin } = require('../../middelwares/authZ');

const { getCategorys, getCategory, addCategory, updateCategory, deleteCategory } = require('./category.controller');

router.get('/category', getCategorys);
router.get('/category/:id', getCategory);

//Admin
router.post('/category', authN, isAdmin, addCategory);
router.put('/category/:id', authN, isAdmin, updateCategory);
router.delete('/category/:id', authN, isAdmin, deleteCategory);

module.exports = router;
