const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/New_Insta_DB");
const plm = require("passport-local-mongoose");

const userSchema = mongoose.Schema({
  username: String,
  name: String,
  password: String,
  description: String,
  email: String,
  profileImage: String,
  contact: Number,
  posts:[
    {
    type: mongoose.Schema.Types.ObjectId,
    ref: "post",
  }
  ]
});

userSchema.plugin(plm);

module.exports = mongoose.model("user", userSchema);
