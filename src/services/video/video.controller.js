const Video = require('./video.model');
const { successfulRes, failedRes } = require('../../utils/response');

exports.getVideos = async (req, res) => {
  try {
    let q = req.query;

    const response = await Video.find(q).exec();

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
    const { name, author, categories, series, youtube_url, summary } = req.body;
    const files = req.files;
    let photos = [];

    const saved = new Video({
      name,
      author,
      categories,
      series,
      square_cover: photos ? photos[0] : 'NULL',
      rectangle_cover: photos ? photos[1] : 'NULL',
      youtube_url,
      summary,
    });

    if(files){
      files.forEach(async e=>{
       const url = await upload_image(e.path, saved._id, 'video_thumbs');
       photos.push(url);
      })
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
    const { name, author, categories, series, youtube_url, summary } = req.body;
    const files = req.files;
    let photos = [];

    let doc = await Video.findById(_id).exec();
    if(files){
      files.forEach(async e=>{
       const url = await upload_image(e.path, saved._id, 'video_thumbs');
       photos.push(url);
      })
    }

    doc.name = name ? name : doc.name;
    doc.author = author ? author : doc.author;
    doc.categories = categories ? categories : doc.categories;
    doc.series = series ? series : doc.series;
    doc.youtube_url = youtube_url ? youtube_url : doc.youtube_url;
    doc.summary = summary ? summary : doc.summary;
    doc.square_cover = photos ? photos[0] : doc.square_cover;
    doc.rectangle_cover = photos ? photos[1] : doc.rectangle_cover;

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
      });
      response.numberOfShare += 1;
    }

    await response.save();

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};