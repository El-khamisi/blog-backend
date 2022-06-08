const { Admin, Author, Visitor } = require('../config/roles');
const { failedRes } = require('../utils/response');
const User = require('../services/user/user.model');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { TOKENKEY, NODE_ENV } = require('../config/env');

exports.isAdmin = (req, res, next) => {
  try {
    if(res.locals.user){
      const role = res.locals.user.role;
      if (role && role == Admin) return next();
      else throw new Error('You are NOT authorized to Admin Routes');
    }else{
      throw new Error('Login first');
    }
  } catch (e) {
    if (e instanceof ReferenceError) return failedRes(res, 500, e);
    else return failedRes(res, 401, e);
  }
};

exports.isAuthor = (req, res, next) => {
  try {
    const role = res.locals.user.role;
    if (role && (role == Author || role == Admin)) return next();
    else throw new Error('You are NOT authorized to Author Routes');
  } catch (e) {
    if (e instanceof ReferenceError) return failedRes(res, 500, e);
    else return failedRes(res, 401, e);
  }
};

exports.myProfile = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const user_id = res.locals.id;

    const role = res.locals.user.role;
    if (role && role == Admin) return next();

    if (_id != user_id) {
      throw new Error('It is NOT you');
    } else {
      return next();
    }
  } catch (e) {
    if (e instanceof ReferenceError) return failedRes(res, 500, e);
    else return failedRes(res, 401, e);
  }
};

exports.myWork = async (req, res, next) => {
  try {
    const role = res.locals.user.role;
    if (role && role == Admin) return next();

    const baseUrl = req.baseUrl;
    const work_id = new mongoose.Types.ObjectId(req.params.id);
    const user_id = res.locals.id;

    const doc = await User.findById(user_id).exec();
    let work = [];
    if (baseUrl == 'article') {
      work = doc.articles;
    } else if (baseUrl == '') {
      work = doc.articles;
    } else if (baseUrl == '') {
      work = doc.articles;
    } else {
      throw new Error('Invalid URL');
    }
    const indWrok = work.indexOf(work_id);
    if (indWrok > -1) {
      res.locals.reqWork = work_id;
      return next();
    } else {
      throw new Error('Invalid Work ID');
    }
  } catch (e) {
    if (e instanceof ReferenceError) return failedRes(res, 500, e);
    else return failedRes(res, 401, e);
  }
};

exports.isGuest = (req, res, next) => {
  try {
    const userAgent = req.headers['user-agent'];
    const newGuestCookie = {
      userAgent: userAgent,
      readArticles: [],
      shareArticles: [],

      readPapers: [],
      sharePapers: [],

      viewVideos: [],
      shareVideos: [],
    };

    const guestCookie = req.cookies.__GuestId ? JSON.parse(req.cookies.__GuestId) : newGuestCookie;
    res.cookie('__GuestId', JSON.stringify(guestCookie), {
      maxAge: 1000 * 60 * 60 * 24 * 365 * 5,
      sameSite: 'none',
      secure: NODE_ENV == 'dev' ? false : true,
    });
    res.locals.guestCookie = guestCookie;
    next();
  } catch (e) {
    if (e instanceof ReferenceError) return failedRes(res, 500, e);
    else return failedRes(res, 401, e);
  }
};
