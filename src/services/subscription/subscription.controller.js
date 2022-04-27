const Subscription = require('./subscription.model');
const { successfulRes, failedRes } = require('../../utils/response');

exports.getSubscriptions = async (req, res) => {
  try {
    let q = req.query;

    let response = await Subscription.find(q).sort('-createdOn');

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.getSubscription = async (req, res) => {
  try {
    const _id = req.params.id;
    let response = await Subscription.findById(_id).exec();

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.addSubscription = async (req, res) => {
  try {
    const { email } = req.body;
    const saved = new Subscription({
      email,
    });
    await saved.save();
    return successfulRes(res, 201, saved);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.updateSubscription = async (req, res) => {
  try {
    const _id = req.params.id;
    const { email } = req.body;
    let doc = await Subscription.findById(_id).exec();

    doc.email = email ? email : doc.email;
    await doc.save();

    return successfulRes(res, 200, doc);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.deleteSubscription = async (req, res) => {
  try {
    const _id = req.params.id;

    const response = await Subscription.findByIdAndDelete(_id).exec();

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};
