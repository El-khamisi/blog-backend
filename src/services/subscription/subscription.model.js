const mongoose = require('mongoose');
const validator = require('validator');

const subscriptionSchema = new mongoose.Schema(
  {
    email: { type: String, trim: true, required: [true, 'Email is required'], unique: true, validate: [validator.isEmail, 'Invalid Email'] },
  },
  {
    timestamps: {
      createdAt: 'createdOn',
      updatedAt: 'updated_at',
    },
  }
);

module.exports = mongoose.model('Subscription', subscriptionSchema);
