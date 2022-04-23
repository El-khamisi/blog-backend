const router = require('express').Router();

const { authN } = require('../../middelwares/authN');
const { myWork, isAuthor, isGuest } = require('../../middelwares/authZ');

const { imageUpload } = require('../../config/multer');
const { getVideos, getVideo, addVideo, updateVideo, deleteVideo, shareVideo } = require('./video.controller');

router.get('/videos', getVideos);
router.get('/video/:id', isGuest, getVideo);
router.get('/video_share/:id', isGuest, shareVideo);

//Admin && Author
router.post('/video', authN, isAuthor, imageUpload.array('photos'), addVideo);
router.put('/video/:id', authN, myWork, imageUpload.array('photos'), updateVideo);
router.delete('/video/:id', authN, myWork, deleteVideo);

module.exports = router;
