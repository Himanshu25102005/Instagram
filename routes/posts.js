const mongoose = require("mongoose"); // to use MongoDB


const postSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  title: String,
  description: String,
  image: String,
  createdAt: {
    type: Date,
    default: Date.now, // auto-set current time
  },
  likes: [
    {
      type: Array,
      default: [],
    },
  ],
});

module.exports = mongoose.model("post", postSchema); // export the 'post' model
