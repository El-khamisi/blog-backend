const Article = require('./article.model');
const { successfulRes, failedRes } = require('../../utils/response');
const {upload_image} = require('../../config/cloudinary');

exports.getArticles = async (req, res) => {
  try {
    let q = req.query;

    let response = await Article.find(q).exec();
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
    const { name, about, writer, cat, paragraphs } = req.body;
    const files = req.files;
    let photos = [];
    if(files){
      files.forEach(async e=>{
       const url = await upload_image(e.path, saved._id, 'articles_thumbs');
       photos.push(url);
      })
    }

    const saved = new Article({
      name,
      about,
      author: writer,
      cat,
      icon: photos ? photos[0] : 'NULL',
      img: photos ? photos[1] : 'NULL',
      paragraphs: paragraphs.map((e) => ({ title: e.split(',')[0], article: e.split(',')[1] })),
    });

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
    const { name, author, categories, paragraphs } = req.body;
    const files = req.files;
    let photos = [];


    let doc = await Article.findById(_id).exec();
    if(files){
      files.forEach(async e=>{
       const url = await upload_image(e.path, doc._id, 'articles_thumbs');
       photos.push(url);
      })
    }

    doc.name = name ? name : doc.name;
    doc.author = author ? author : doc.author;
    doc.categories = categories ? categories : doc.categories;
    doc.paragraphs = paragraphs ? paragraphs.map((e) => ({ title: e.split(',')[0], article: e.split(',')[1] })) : doc.paragraphs;
    doc.square_cover = photos ? photos[0] : doc.square_cover;
    doc.rectangle_cover = photos ? photos[1] : doc.rectangle_cover;

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
      });
      response.numberOfShare += 1;
    }

    await response.save();

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};
