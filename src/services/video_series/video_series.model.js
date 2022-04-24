const mongoose = require('mongoose');

const seriesSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
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

seriesSchema.virtual('videos', {
  ref: 'Video',
  localField: '_id',
  foreignField: 'series',
});

module.exports = mongoose.model('Video_series', seriesSchema);
