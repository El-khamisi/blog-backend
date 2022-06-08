const User = require('../user/user.model');
const Paper = require('./paper.model');
const { successfulRes, failedRes } = require('../../utils/response');
const { upload_image } = require('../../config/cloudinary');
const { NODE_ENV } = require('../../config/env');

exports.getPapers = async (req, res) => {
  try {
    let q = req.query;

    let response = await Paper.find(q).sort('-createdOn');
    if (response?.length && response.length > 0) {
      for (let i = 0; i < response.length; i++) {
        response[i] = await response[i];
      }
    } else if (response) {
      response = await response.populate('Papers papers videos');
    }

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.getPaper = async (req, res) => {
  try {
    const _id = req.params.id;
    let response = await Paper.findById(_id).exec();
    const guestCookie = res.locals.guestCookie;

    if (guestCookie.readPapers.indexOf(_id) < 0) {
      guestCookie.readPapers.push(_id);
      res.cookie('__GuestId', JSON.stringify(guestCookie), {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 5,
        sameSite: 'none',
        secure: NODE_ENV == 'dev' ? false : true,
      });
      response.numberOfView += 1;
    }

    await response.save();

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};
exports.getAdminPaper = async (req, res) => {
  try {
    const _id = req.params.id;
    const response = await Paper.findById(_id).exec();
    const writers = await User.aggregate([
      {
        $match: { role: Author },
      },
      {
        $project: { _id: 1, name: 1 },
      },
    ]);
    response._doc.writers = writers;

    return successfulRes(res, 200, { response });
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.addPaper = async (req, res) => {
  try {
    // const user_id = res.locals.user.id;
    const { name, about, writer, cat, type, paragraphs, body, editor, trans, editor_2 } = req.body;
    const files = req.files;

    const saved = new Paper({
      name,
      about,
      author: writer,
      editor,
      editor_2,
      trans,
      cat,
      type,
      icon: 'NULL',
      img: 'NULL',
      // paragraphs: paragraphs?.map((e) => ({ title: e.split(',')[0], Paper: e.split(',')[1] })),
      body,
    });
    await saved.save();

    if (files) {
      let photos = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = await upload_image(file.path, `${saved._id}_${i}`, 'papers_thumbs');
        photos.push(url);
      }
      saved.icon = photos[0];
      saved.img = photos[1];
    }
    await saved.save();

    return successfulRes(res, 201, saved);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.updatePaper = async (req, res) => {
  try {
    const role = res.locals.user.role;

    const _id = req.params.id;
    const { name, about, writer, cat, type, paragraphs, body, editor, trans, editor_2 } = req.body;
    const files = req.files;

    let doc = await Paper.findById(_id).exec();
    if (files) {
      let photos = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = await upload_image(file.path, `${doc._id}_${i}`, 'papers_thumbs');
        photos.push(url);
      }
      doc.icon = photos[0] ? photos[0] : doc.icon;
      doc.img = photos[1] ? photos[1] : doc.img;
    }

    doc.name = name ? name : doc.name;
    doc.author = writer ? writer : doc.author;
    doc.editor = editor ? editor : doc.editor;
    doc.trans = trans ? trans : doc.trans;
    doc.editor_2 = editor_2 ? editor_2 : doc.editor_2;
    doc.cat = cat ? cat : doc.cat;
    doc.type = type ? type : doc.type;
    doc.body = body ? body : doc.body;
    doc.about = about ? about : doc.about;
    // doc.paragraphs = paragraphs ? paragraphs?.map((e) => ({ title: e.split(',')[0], Paper: e.split(',')[1] })) : doc.paragraphs;

    await doc.save();

    return successfulRes(res, 200, doc);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.deletePaper = async (req, res) => {
  try {
    const _id = req.params.id;

    const response = await Paper.findByIdAndDelete(_id).exec();

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.sharePaper = async (req, res) => {
  try {
    const _id = req.params.id;
    let response = await Paper.findById(_id).exec();
    const guestCookie = res.locals.guestCookie;

    if (guestCookie.sharePapers.indexOf(_id) < 0) {
      guestCookie.sharePapers.push(_id);
      res.cookie('__GuestId', JSON.stringify(guestCookie), {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 5,
        sameSite: 'none',
        secure: NODE_ENV == 'dev' ? false : true,
      });
      response.numberOfShare += 1;
    }

    await response.save();

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};
