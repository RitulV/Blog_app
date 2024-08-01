const { Router } = require("express");
const User = require("../models/user");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const router = Router();

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.post("/signup", upload.single("profileImage"), async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const profileImageURL = req.file
      ? `/uploads/${req.file.filename}`
      : undefined;
    await User.create({ fullName, email, password, profileImageURL });
    return res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error signing up");
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).render("signin", {
      error: "Incorrect email or password...",
    });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

module.exports = router;
