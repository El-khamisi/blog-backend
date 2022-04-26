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
    summary: { type: String },
    viewCount: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 },
  },
  {
    timestamps: {
      createdAt: 'created_at',
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
