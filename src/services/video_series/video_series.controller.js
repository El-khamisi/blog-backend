const Video_series = require('./video_series.model');
const { successfulRes, failedRes } = require('../../utils/response');

exports.getSerieses = async (req, res) => {
  try {
    let q = req.query;

    const response = await Video_series.find(q).exec();
    if (response?.length && response.length > 0) {
      for (let i = 0; i < response.length; i++) {
        response[i] = await response[i].populate('videos');
      }
    } else if (response) {
      response = await response.populate('videos');
    }

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.getSeries = async (req, res) => {
  try {
    const _id = req.params.id;
    let response = await Video_series.findById(_id).populate('videos');

    await response.save();

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.addSeries = async (req, res) => {
  try {
    const { name } = req.body;

    const saved = new Video_series({
      name,
    });

    await saved.save();

    return successfulRes(res, 201, saved);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.updateSeries = async (req, res) => {
  try {
    const _id = req.params.id;
    const { name, videos } = req.body;

    let doc = await Video_series.findById(_id).exec();

    doc.name = name ? name : doc.name;
    doc.videos = videos ? videos : doc.videos;

    await doc.save();

    return successfulRes(res, 200, doc);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.deleteSeries = async (req, res) => {
  try {
    const _id = req.params.id;

    const response = await Video_series.findByIdAndDelete(_id).exec();

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};
