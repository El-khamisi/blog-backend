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


userSchema.virtual('videos',{
  ref: 'Video',
  localField: '_id',
  foreignField: 'author'
});

module.exports = mongoose.model('Video_series', seriesSchema);
