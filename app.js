if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const campgroundsRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");
const User = require("./models/user");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const MongoStore = require("connect-mongo");

const dbUrl = "mongodb://localhost:27017/yelp-camp";
//process.env.DB_URL;
mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("🙆MongoDB connection ok 🙆MongoDB　connection ok 🙆");
  })
  .catch(() => {
    console.log("❌MongoDB　connection error❌MongoDB　connection error❌");
  });

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: "mysecret",
  },
  touchAfter: 24 * 3600, // time period in seconds
});

store.on('error', e => console.log('セッションストアエラー',e));

const sessionConfig = {
  store,
  secret: "mysecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
};
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

const scriptSrcUrls = ["https://api.mapbox.com", "https://cdn.jsdelivr.net"];
const styleSrcUrls = ["https://api.mapbox.com", "https://cdn.jsdelivr.net"];
const connectSrcUrls = [
  "https://api.mapbox.com",
  "https://*.tiles.mapbox.com",
  "https://events.mapbox.com",
];
const fontSrcUrls = [];
const imgSrcUrls = [
  `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`,
  "https://images.unsplash.com",
];

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      childSrc: ["blob:"],
      objectSrc: [],
      imgSrc: ["'self'", "blob:", "data:", ...imgSrcUrls],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

// app.use(mongoSanitize());

app.get("/", (req, res) => {
  res.render("campgrounds/home");
});

app.use("/", userRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.all(/.*/, (req, res, next) => {
  next(new ExpressError("page was not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) {
    err.message = "問題が起きました";
  }
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("🍉 waiting request at port 3000......");
});
