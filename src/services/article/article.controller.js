const Article = require('./article.model');
const { successfulRes, failedRes } = require('../../utils/response');
const { upload_image } = require('../../config/cloudinary');
const { NODE_ENV } = require('../../config/env');

exports.getArticles = async (req, res) => {
  try {
    let q = req.query;

    let response = await Article.find(q).sort('-createdOn');
    if (response?.length && response.length > 0) {
      for (let i = 0; i < response.length; i++) {
        response[i] = await response[i];
      }
    } else if (response) {
      response = await response.populate('articles papers videos');
    }

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.getArticle = async (req, res) => {
  try {
    const _id = req.params.id;
    let response = await Article.findById(_id).exec();
    const guestCookie = res.locals.guestCookie;

    if (guestCookie.readArticles.indexOf(_id) < 0) {
      guestCookie.readArticles.push(_id);
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

exports.addArticle = async (req, res) => {
  try {
    // const user_id = res.locals.user.id;
    const { name, about, writer, cat, type, paragraphs, body, editor } = req.body;
    const files = req.files;

    const saved = new Article({
      name,
      about,
      author: writer,
      editor,
      cat,
      type,
      icon: 'NULL',
      img: 'NULL',
      // paragraphs: paragraphs?.map((e) => ({ title: e.split(',')[0], article: e.split(',')[1] })),
      body
    });
    await saved.save();

    if (files) {
      let photos = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = await upload_image(file.path, `${saved._id}_${i}`, 'articles_thumbs');
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

exports.updateArticle = async (req, res) => {
  try {
    const role = res.locals.user.role;

    const _id = req.params.id;
    const { name, writer, cat, type, paragraphs, body, editor } = req.body;
    const files = req.files;

    let doc = await Article.findById(_id).exec();
    if (files) {
      let photos = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = await upload_image(file.path, `${doc._id}_${i}`, 'articles_thumbs');
        photos.push(url);
      }
      doc.icon = photos[0] ? photos[0] : doc.icon;
      doc.img = photos[1] ? photos[1] : doc.img;
    }

    doc.name = name ? name : doc.name;
    doc.author = writer ? writer : doc.author;
    doc.editor = editor ? editor : doc.editor;
    doc.cat = cat ? cat : doc.cat;
    doc.type = type ? type : doc.type;
    doc.body = body ? body : doc.body;
    // doc.paragraphs = paragraphs ? paragraphs?.map((e) => ({ title: e.split(',')[0], article: e.split(',')[1] })) : doc.paragraphs;

    await doc.save();

    return successfulRes(res, 200, doc);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    const _id = req.params.id;

    const response = await Article.findByIdAndDelete(_id).exec();

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.shareArticle = async (req, res) => {
  try {
    const _id = req.params.id;
    let response = await Article.findById(_id).exec();
    const guestCookie = res.locals.guestCookie;

    if (guestCookie.shareArticles.indexOf(_id) < 0) {
      guestCookie.shareArticles.push(_id);
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
