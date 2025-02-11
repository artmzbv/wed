const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    // We store an array of comment objects in one document (similar to your FAQs and Photos models)
    comments: [
      {
        name: { type: String, required: true },
        src: { type: String, required: true },
        review: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comments', commentSchema);
