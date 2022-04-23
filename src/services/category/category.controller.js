const Category = require('./category.model');
const { successfulRes, failedRes } = require('../../utils/response');

exports.getCategorys = async (req, res) => {
  try {
    const response = await Category.find({}).exec();

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.getCategory = async (req, res) => {
  try {
    const _id = req.params.id;
    let response = await Category.findById(_id).exec();

    await response.save();

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const saved = new Category({
      name,
    });
    await saved.save();

    return successfulRes(res, 201, saved);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const _id = req.params.id;
    const { name } = req.body;

    let doc = await Category.findById(_id).exec();
    doc.name = name ? name : doc.name;
    await doc.save();

    return successfulRes(res, 200, doc);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const _id = req.params.id;

    const response = await Category.findByIdAndDelete(_id).exec();

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};
