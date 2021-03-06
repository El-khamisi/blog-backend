const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validator = require('validator');

//configuration
const { TOKENKEY, NODE_ENV } = require('../../config/env');
const roles = require('../../config/roles');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, trim: true },
    password: { type: String },
    role: { type: String, enum: [...Object.values(roles), 'Invalid role title'], default: roles.Visitor },
    thumbnail: { type: String },
    facebook: { type: String },
    twitter: { type: String },
    description: { type: String },
    is_deleted: { type: Boolean, default: false },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual('articles', {
  ref: 'Article',
  localField: '_id',
  foreignField: 'author',
});

userSchema.virtual('papers', {
  ref: 'Paper',
  localField: '_id',
  foreignField: 'author',
});

userSchema.virtual('videos', {
  ref: 'Video',
  localField: '_id',
  foreignField: 'author',
});

userSchema.methods.generateToken = function (res) {
  const token = jwt.sign(
    {
      id: this._id,
      name: this.name,
      email: this.email,
      photo: this.thumbnail,
      role: this.role,
      facebook: this.facebook,
      twitter: this.twitte,
    },
    TOKENKEY,
    { expiresIn: '24h' }
  );

  res.cookie('authorization', token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, //7 days OR one week
    sameSite: 'none',
    secure: NODE_ENV == 'dev' ? false : true,
  });
  return token;
};

userSchema.pre('save', async function (next) {
  if (this.email && this.password) {
    this.password = bcrypt.hashSync(this.password, 10);
  }
  next();
});

//Exclude findOne for Login password
userSchema.post(['save', 'find', 'findByIdAndUpdate', 'findByIdAndDelete'], function (doc, next) {
  if (!doc) {
    next();
  } else if (doc.length && doc.length > 0) {
    doc.forEach((e, i) => {
      doc[i].password = undefined;
    });
  } else {
    doc.password = undefined;
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
