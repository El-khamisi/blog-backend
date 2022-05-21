const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    about: { type: String, trim: true },
    author: { type: mongoose.Types.ObjectId, ref: 'User' },
    writer: { type: String, trim: true },
    editor: {type: String, trim: true},
    icon: { type: String },
    img: { type: String },
    cat: [{ type: String, trim: true }],
    type: { type: String, trim: true },
    // paragraphs: [
    //   {
    //     title: String,
    //     article: String,
    //   },
    // ],
    body: {type: String},
    numberOfShare: { type: Number, default: 0 },
    numberOfView: { type: Number, default: 0 },
  },
  {
    timestamps: {
      createdAt: 'createdOn',
      updatedAt: 'updated_at',
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

articleSchema.pre('save', async function () {
  if (this.author) {
    const doc = await mongoose.connection.models.User.findById(this.author).exec();
    this.writer = doc.name;
  }
});

module.exports = mongoose.model('Article', articleSchema);
