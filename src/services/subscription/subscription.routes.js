const router = require('express').Router();

const { authN } = require('../../middelwares/authN');
const { isAdmin } = require('../../middelwares/authZ');
const { getSubscriptions, getSubscription, addSubscription, updateSubscription, deleteSubscription } = require('./subscription.controller');

router.get('/subscriptions', getSubscriptions);
router.get('/subscription/:id', getSubscription);
router.post('/subscription', addSubscription);
router.put('/subscription/:id', updateSubscription);
router.delete('/subscription/:id', authN, isAdmin, deleteSubscription);

module.exports = router;
