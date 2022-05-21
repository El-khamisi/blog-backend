const User = require('./user.model');
const { successfulRes, failedRes } = require('../../utils/response');
const { upload_image } = require('../../config/cloudinary');

exports.getUsers = async (req, res) => {
  try {
    let q = req.query;

    let response = await User.find(q).exec();
    if (response?.length && response.length > 0) {
      for (let i = 0; i < response.length; i++) {
        response[i] = await response[i].populate('articles papers videos');
      }
    } else if (response) {
      response = await response.populate('articles papers videos');
    }
    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.getUser = async (req, res) => {
  try {
    const _id = req.params.id;

    const response = await User.findById(_id).populate('articles papers videos');
    response.password = undefined;

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.addUser = async (req, res) => {
  const { name, email, password, role, facebook, twitter, description } = req.body;
  const file = req.file?.path;
  let thumbnail;

  try {
    const saved = new User({
      name,
      email,
      password,
      role,
      facebook,
      twitter,
      description,
      thumbnail,
    });

    if (file) {
      saved.thumbnail = await upload_image(file, saved._id, 'user_thumbs');
    }
    await saved.save();

    return successfulRes(res, 201, saved);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const _id = req.params.id;
    const { name, email, password, facebook, twitter, description } = req.body;
    const file = req.file?.path;

    let doc = await User.findById(_id);
    if (file) {
      doc.thumbnail = await upload_image(file, doc._id, 'user_thumbs');
    }

    doc.name = name ? name : doc.name;
    doc.email = email ? email : doc.email;
    doc.password = password ? password : doc.password;
    doc.facebook = facebook ? facebook : doc.facebook;
    doc.twitter = twitter ? twitter : doc.twitter;
    doc.description = description ? description : doc.description;


    const valid = doc.validateSync();
    if (valid) throw valid;
    await doc.save();
    doc.password = undefined;
    return successfulRes(res, 200, doc);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const _id = req.params.id;

    const response = await User.findByIdAndDelete(_id).exec();
    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};
