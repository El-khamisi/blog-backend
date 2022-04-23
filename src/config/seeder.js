const User = require('../services/user/user.model');
const { Admin } = require('./roles');

const superAdmin = async () => {
  const prototype = {
    name: 'Cup Cake',
    email: 'admin@test.com',
    password: 'admin123',
    role: Admin,
  };

  try {
    await User.findOneAndDelete({
      email: 'admin@test.com',
    }).exec();
    const saved = new User(prototype);
    await saved.save();
    console.log('ADMIN USER CREATED SUCCESSFULLY')
  } catch (e) {
    console.log('CAN NOT CREATE SUPER ADMIN' + e.message);
  }
};

module.exports = {
  superAdmin,
};
