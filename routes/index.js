var express = require("express");
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");
const passport = require("passport");
const upload = require("./multer");
const localStrategy = require("passport-local").Strategy;

passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("index", { title: "Express" });
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/",
    successRedirect: "/profile",
  }),
  (req, res) => {}
);

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  const data = new userModel({
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
  });

  userModel.register(data, req.body.password).then(() => {
    passport.authenticate("local")(req, res, () => {
      res.redirect("profile");
    });
  });
});

const isloggedin = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/");
  }
};

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

router.get("/profile", isloggedin, async (req, res) => {
  const user = await userModel
    .findOne({ username: req.session.passport.user })
    .populate("posts");
  console.log(user);
  res.render("profile", { user });
});

router.post("/upload", upload.single("file"), async (req, res) => {
  const user = await userModel.findOne({ username: req.session.passport.user });

  if (!req.file) {
    return res.status(400).send("No Files were Uploaded");
  } else {
    user.profileImage = req.file.filename;
    await user.save();
  }

  res.redirect("profile");
});

router.get("/profile/edit", isloggedin, async (req, res) => {
  const user = await userModel.findOne({ username: req.session.passport.user });
  res.render("editProfile", { user });
});

router.post("/profile/edit", isloggedin, async (req, res) => {
  const user = await userModel.findOne({ username: req.session.passport.user });

  user.email = req.body.email;
  user.description = req.body.description;
  user.contact = req.body.contact;

  await user.save();

  res.redirect("/profile");
});

router.get("/create", isloggedin, async (req, res) => {
  const user = await userModel.findOne({ username: req.session.passport.user });
  res.render("create", { user });
});

router.post("/create", isloggedin, upload.single("image"), async (req, res) => {
  const user = await userModel.findOne({ username: req.session.passport.user });

  const postdata = new postModel({
    user: user._id,
    title: req.body.title,
    description: req.body.description,
    image: req.file.filename,
  });

  user.posts.push(postdata._id);
  await postdata.save();
  await user.save();

  console.log(postdata);

  res.redirect("profile");
});

router.get("/feed", isloggedin, async (req, res) => {

  const users = await userModel.find().populate("posts");
  /* console.log(users) */
  res.render("feed", {users});
});

module.exports = router;
