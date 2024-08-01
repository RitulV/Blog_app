const express = require("express");
const path = require("path");
const { checkForAuthenticationCookie } = require("./middleware/auth");

require("dotenv").config();

const userRouter = require("./routes/user");
const blogRouter = require("./routes/blog");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const Blog = require("./models/blog");

const app = express();
const PORT = process.env.PORT || 5000;
const DB = process.env.MONGO_URL;   

mongoose.connect(DB).then(() => {
  console.log('connection successfull to MongoDB Atlas!')
}).catch((err) => console.log('error: ', err));


app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});;
  return res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.use("/user", userRouter);
app.use("/blog", blogRouter);

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
