const User = require('./user.model');
const { successfulRes, failedRes } = require('../../utils/response');

exports.profileView = async (req, res) => {
  try {
    const _id = res.locals.user.id;
    let response = await User.findById(_id).exec();
    response.password = undefined;

    response = await response.populate({ path: 'articles' });

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.profileUpdate = async (req, res) => {
  try {
    const _id = res.locals.user.id;
    const { name, email, password, facebook, twitter } = req.body;
    const thumbnail = req.file?.path;

    let doc = await User.findById(_id);

    doc.name = name ? name : doc.name;
    doc.email = email ? email : doc.email;
    doc.password = password ? password : doc.password;
    doc.facebook = facebook ? facebook : doc.facebook;
    doc.twitter = twitter ? twitter : doc.twitter;
    doc.thumbnail = thumbnail ? thumbnail : doc.thumbnail;

    const valid = doc.validateSync();
    if (valid) throw valid;
    await doc.save();
    doc.password = undefined;
    return successfulRes(res, 200, doc);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.profileDelete = async (req, res) => {
  try {
    const _id = res.locals.user.id;

    const response = await User.findByIdAndDelete(_id).exec();

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};
