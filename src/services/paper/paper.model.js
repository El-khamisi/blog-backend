const mongoose = require('mongoose');

const paperSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    author: { type: mongoose.Types.ObjectId, ref: 'User' },
    writer: { type: String, trim: true },
    icon: { type: String },
    img: { type: String },
    cat: [{ type: String, trim: true }],
    type: { type: String, trim: true },
    paragraphs: [
      {
        title: String,
        text: String,
      },
    ],
    numberOfShare: { type: Number, default: 0 },
    numberOfView: { type: Number, default: 0 },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

paperSchema.pre('save', async function () {
  if (this.author) {
    const doc = await mongoose.connection.models.User.findById(this.author).exec();
    this.writer = doc.name;
  }
});

module.exports = mongoose.model('Paper', paperSchema);
