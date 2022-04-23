const router = require('express').Router();

const { authN } = require('../../middelwares/authN');
const { myWork, isAuthor, isGuest, isAdmin } = require('../../middelwares/authZ');

const {getSerieses, getSeries, addSeries, updateSeries, deleteSeries } = require('./video_series.controller');

router.get('/serieses', getSerieses);
router.get('/series/:id', getSeries);

//Admin && Author
router.post('/series', authN, isAdmin, addSeries);
router.put('/series/:id', authN, isAdmin,updateSeries);
router.delete('/series/:id', authN, isAdmin, deleteSeries);

module.exports = router;
