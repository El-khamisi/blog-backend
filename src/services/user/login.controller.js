const User = require('../user/user.model');
const bcrypt = require('bcrypt');
const { successfulRes, failedRes } = require('../../utils/response');
const {NODE_ENV} = require('../../config/env');

exports.regUser = async (req, res) => {
  const { name, email, password, facebook, twitter } = req.body;
  const file = req.file?.path;
  let thumbnail;
  try {
    const saved = new User({
      name,
      email,
      password,
      facebook,
      twitter,
      thumbnail,
    });

    await saved.save();
    if (file) {
      saved.thumbnail = await upload_image(file, saved._id, 'user_thumbs');
    }
    const token = saved.generateToken(res);
    return successfulRes(res, 201, { token });
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.logUser = async (req, res) => {
  let { email, password } = req.body;
  if (!email || !password) {
    return failedRes(res, 400, null, 'Email and password are REQUIRED');
  }

  try {
    let logged = await User.findOne({
      email,
    }).exec();
    if (!logged) {
      return failedRes(res, 400, null, 'Email is invalid');
    }

    const matched = bcrypt.compareSync(password, logged.password);
    if (!logged || !matched) {
      return failedRes(res, 400, null, 'Email or Password is invalid');
    }
    const token = logged.generateToken(res);

    return successfulRes(res, 200, { token });
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.logout = (req, res) => {
  try {
    
    res.cookie('authorization', '', {
      sameSite: NODE_ENV == 'dev' ? false : 'none',
      secure: NODE_ENV == 'dev' ? false : true,
    });
    successfulRes(res, 200, 'You have been logged out successfully');
  } catch (err) {
    failedRes(res, 500, 'Invalid logout operation');
  }
};
