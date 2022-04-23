const router = require('express').Router();

const { authN } = require('../../middelwares/authN');
const { myWork, isGuest, isAuthor } = require('../../middelwares/authZ');

const { imageUpload } = require('../../config/multer');
const { getPapers, getPaper, addPaper, updatePaper, deletePaper, sharePaper } = require('./paper.controller');

router.get('/papers', getPapers);
router.get('/paper/:id', isGuest, getPaper);
router.get('/paper_share/:id', isGuest, sharePaper);

// Author
router.post('/paper', authN, isAuthor, imageUpload.array('photos'), addPaper);
router.put('/paper/:id', authN, myWork, imageUpload.array('photos'), updatePaper);
router.delete('/paper/:id', authN, myWork, deletePaper);

module.exports = router;
