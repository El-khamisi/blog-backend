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
    const { name, about, writer, cat, type, paragraphs } = req.body;
    const files = req.files;
    
    const saved = new Paper({
      name,
      about,
      author: writer,
      cat,
      type,
      icon: 'NULL',
      img:'NULL',
      paragraphs: paragraphs?.map((e) => ({ title: e.split(',')[0], article: e.split(',')[1] })),
    });
    await saved.save();


    if(files){
      let photos = [];
      for(const file of files){
        const url = await upload_image(file.path, saved._id, 'articles_thumbs');
        photos.push(url)
      }
      saved.icon = photos[0]
      saved.img = photos[1]
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
    const { name, writer, cat, type, paragraphs } = req.body;
    const files = req.files;

    let doc = await Paper.findById(_id).exec();
    if(files){
      let photos = [];
      for(const file of files){
        const url = await upload_image(file.path, saved._id, 'articles_thumbs');
        photos.push(url)
      }
      doc.icon = photos[0] ? photos[0] : doc.icon;
      doc.img = photos[1] ? photos[1] : doc.img;
    }

    doc.name = name ? name : doc.name;
    doc.author = writer ? writer : doc.author;
    doc.cat = cat ? cat : doc.cat;
    doc.type = type ? type : doc.type;
    doc.paragraphs = paragraphs ? paragraphs?.map((e) => ({ title: e.split(',')[0], article: e.split(',')[1] })) : doc.paragraphs;


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
