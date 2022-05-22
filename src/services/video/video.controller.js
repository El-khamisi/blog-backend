const Video = require('./video.model');
const { successfulRes, failedRes } = require('../../utils/response');
const { upload_image } = require('../../config/cloudinary');
const { NODE_ENV } = require('../../config/env');

exports.getVideos = async (req, res) => {
  try {
    let q = req.query;

    const response = await Video.find(q).sort('-createdOn');

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.getVideo = async (req, res) => {
  try {
    const _id = req.params.id;
    let response = await Video.findById(_id).exec();
    const guestCookie = res.locals.guestCookie;

    if (guestCookie.viewVideos.indexOf(_id) < 0) {
      guestCookie.viewVideos.push(_id);
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

exports.addVideo = async (req, res) => {
  try {
    const { name, writer, cat, type, series, youtube_url, about } = req.body;
    const files = req.files;

    const saved = new Video({
      name,
      author: writer,
      cat,
      type,
      series,
      icon: 'NULL',
      img: 'NULL',
      youtube_url,
      about,
    });
    await saved.save();

    if (files) {
      let photos = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = await upload_image(file.path, `${saved._id}_${i}`, 'video_thumbs');
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

exports.updateVideo = async (req, res) => {
  try {
    const _id = req.params.id;
    const { name, writer, cat, type, series, youtube_url, about } = req.body;
    const files = req.files;

    let doc = await Video.findById(_id).exec();
    if (files) {
      let photos = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = await upload_image(file.path, `${saved._id}_${i}`, 'video_thumbs');
        photos.push(url);
      }
      doc.icon = photos[0] ? photos[0] : doc.icon;
      doc.img = photos[1] ? photos[1] : doc.img;
    }

    doc.name = name ? name : doc.name;
    doc.author = writer ? writer : doc.author;
    doc.cat = cat ? cat : doc.cat;
    doc.type = type ? type : doc.type;
    doc.series = series ? series : doc.series;
    doc.youtube_url = youtube_url ? youtube_url : doc.youtube_url;
    doc.about = about ? about : doc.about;

    await doc.save();

    return successfulRes(res, 200, doc);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.deleteVideo = async (req, res) => {
  try {
    const _id = req.params.id;

    const response = await Video.findByIdAndDelete(_id).exec();

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.shareVideo = async (req, res) => {
  try {
    const _id = req.params.id;
    let response = await Video.findById(_id).exec();
    const guestCookie = res.locals.guestCookie;

    if (guestCookie.shareVideos.indexOf(_id) < 0) {
      guestCookie.shareVideos.push(_id);
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
