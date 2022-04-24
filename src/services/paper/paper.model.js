const mongoose = require('mongoose');

const paperSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    author: { type: mongoose.Types.ObjectId, ref: 'User' },
    icon: { type: String },
    img: { type: String },
    categories: [{ type: mongoose.Types.ObjectId, ref: 'Category' }],
    paragraphs: [
      {
        title: String,
        text: String,
      },
    ],
    readsCount: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

module.exports = mongoose.model('Paper', paperSchema);
