const router = require('express').Router();

const { authN } = require('../../middelwares/authN');
const { myWork, isAuthor, isGuest } = require('../../middelwares/authZ');

const { imageUpload } = require('../../config/multer');
const { getArticles, getArticle, addArticle, updateArticle, deleteArticle, shareArticle } = require('./article.controller');

router.get('/articles', getArticles);
router.get('/article/:id', isGuest, getArticle);
router.get('/article_share/:id', isGuest, shareArticle);

//Admin && Author
// router.post('/article', authN, isAuthor, imageUpload.array('photos'), addArticle);
router.post('/article', imageUpload.single('icon'), imageUpload.single('img'), towPhotos,addArticle);
router.put('/article/:id', authN, myWork, imageUpload.array('photos'), updateArticle);
router.delete('/article/:id', authN, myWork, deleteArticle);

module.exports = router;
