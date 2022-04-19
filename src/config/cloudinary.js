const { cloudinary_name, cloudinary_api_key, cloudinary_api_secret } = require('./env');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: cloudinary_name,
  api_key: cloudinary_api_key,
  api_secret: cloudinary_api_secret,
});

exports.users_thumbs = async (imagePath, imageName) => {
  const img = await cloudinary.uploader.upload(
    imagePath,
    {
      public_id: 'assets/users_thumbs/' + imageName,
      overwrite: true,
      tags: 'users_thumbs',
    },
    function (err, image) {
      if (err) throw new Error('An error has been occurred when uploading a photo');
    }
  );
  return img.url;
};