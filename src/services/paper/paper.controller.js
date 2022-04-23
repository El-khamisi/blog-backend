const Paper = require('./paper.model');
const { successfulRes, failedRes } = require('../../utils/response');

exports.getPapers = async (req, res) => {
  try {
    let q = req.query;

    const response = await Paper.find(q).exec();

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
      });
      response.numberOfView += 1;
    }
    await response.save();

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.addPaper = async (req, res) => {
  try {
    const { name, author, categories, paragraphs } = req.body;
    const files = req.files;
    let photos = [];

    const saved = new Paper({
      name,
      author,
      categories,
      square_cover: photos ? photos[0] : 'NULL',
      rectangle_cover: photos ? photos[1] : 'NULL',
      paragraphs: paragraphs.map((e) => ({ title: e.split(',')[0], article: e.split(',')[1] })),
    });

    if(files){
      files.forEach(async e=>{
       const url = await upload_image(e.path, saved._id, 'papers_thumbs');
       photos.push(url);
      })
    }
    await saved.save();

    return successfulRes(res, 201, saved);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.updatePaper = async (req, res) => {
  try {
    const _id = req.params.id;
    const { name, author, categories, paragraphs } = req.body;
    const files = req.files;
    let photos = [];

    let doc = await Paper.findById(_id).exec();
    if(files){
      files.forEach(async e=>{
       const url = await upload_image(e.path, saved._id, 'papers_thumbs');
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
      });
      response.numberOfShare += 1;
    }

    await response.save();
    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};
