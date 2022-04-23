const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    author: { type: mongoose.Types.ObjectId, ref: 'User' },
    square_cover: { type: String },
    rectangle_cover: { type: String },
    categories: [{ type: mongoose.Types.ObjectId, ref: 'Category' }],
    series: { type: mongoose.Types.ObjectId, ref: 'Video_series' },
    youtube_url: { type: String },
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

module.exports = mongoose.model('Video', videoSchema);
