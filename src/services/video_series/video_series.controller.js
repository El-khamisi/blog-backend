const Video_series = require('./Series_series.model');
const { successfulRes, failedRes } = require('../../utils/response');

exports.getSerieses = async (req, res) => {
  try {
    let q = req.query;
    
    const response = await Video_series.find(q).exec();

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.getSeries = async (req, res) => {
  try {
    const _id = req.params.id;
    let response = await Video_series.findById(_id).exec();

    await response.save();

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.addSeries = async (req, res) => {
  try {
    const { name, videos} = req.body;

    const saved = new Video_series({
      name,
      videos
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
    const { name, videos} = req.body;

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