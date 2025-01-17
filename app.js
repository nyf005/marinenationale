const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");

//Load Models
require("./models/User");
require("./models/Rank");
require("./models/Unite");
require("./models/Service");
require("./models/Training");
require("./models/Information");
require("./models/Actualite");
require("./models/Movement");
require("./models/Promotion");
require("./models/Affectation");
require("./models/Photo");

//Load routes
const index = require("./routes/index");
const users = require("./routes/users");
const ranks = require("./routes/ranks");
const unites = require("./routes/unites");
const services = require("./routes/services");
const trainings = require("./routes/trainings");
const guichetunique = require("./routes/guichetunique");
const informations = require("./routes/informations");
const actualites = require("./routes/actualites");
const movements = require("./routes/movements");
const promotions = require("./routes/promotions");
const affectations = require("./routes/affectations");
const gallery = require("./routes/gallery");

//Load Keys
const keys = require("./config/keys");

//Handlebars Helpers
const {
  select,
  getAge,
  dateFormat,
  formatDate,
  ensureAuthenticated,
  checkGrant,
  ifCond,
  toTitleCase,
  resizeImg,
  truncate,
  stripTags,
  editIcon
} = require("./helpers/functions");

//Map global promises
mongoose.Promise = global.Promise;

//Mongoose Connect
mongoose
  .connect(
    keys.mongoURI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch(err => console.log(err));

const app = express();

//Passport config
require("./config/passport")(passport);


//Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Method Override Middleware
app.use(methodOverride("_method"));

//Handlebars middleware
app.engine(
  "handlebars",
  exphbs({
    helpers: {
      select: select,
      getAge: getAge,
      dateFormat: dateFormat,
      formatDate: formatDate,
      ensureAuthenticated: ensureAuthenticated,
      checkGrant: checkGrant,
      ifCond: ifCond,
      toTitleCase: toTitleCase,
      resizeImg: resizeImg,
      truncate: truncate,
      stripTags: stripTags,
      editIcon: editIcon
    },
    defaultLayout: "main"
  })
);

app.set("view engine", "handlebars");

//cookie-parser middleware
app.use(cookieParser());

//express-session middleware
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
  })
);

//Passport session middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash message middleware
app.use(flash());

//Set global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.errors_msg = req.flash("errors_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

//Set Static Folder
app.use(express.static(path.join(__dirname, "public")));

//Use routes
app.use("/", index);
app.use("/users", users);
app.use("/ranks", ranks);
app.use("/unites", unites);
app.use("/services", services);
app.use("/trainings", trainings);
app.use("/guichetunique", guichetunique);
app.use("/informations", informations);
app.use("/actualites", actualites);
app.use("/movements", movements);
app.use("/promotions", promotions);
app.use("/affectations", affectations);
app.use("/gallery", gallery);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
