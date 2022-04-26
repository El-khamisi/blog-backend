const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    author: { type: mongoose.Types.ObjectId, ref: 'User' },
    writer: { type: String, trim: true },
    icon: { type: String },
    img: { type: String },
    cat: [{ type: String, trim: true }],
    type: { type: String, trim: true },
    series: { type: mongoose.Types.ObjectId, ref: 'Video_series' },
    youtube_url: { type: String},
    about: { type: String },
    numberOfShare: { type: Number, default: 0 },
    numberOfView: { type: Number, default: 0 },
  },
  {
    timestamps: {
      createdAt: 'createdOn',
      updatedAt: 'updated_at',
    },
  }
);

videoSchema.pre('save', async function () {
  if (this.author) {
    const doc = await mongoose.connection.models.User.findById(this.author).exec();
    this.writer = doc.name;
  }
});

module.exports = mongoose.model('Video', videoSchema);
