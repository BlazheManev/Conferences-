const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require("cors");
const middleware = require("./middleware/index")

const app = express();


var allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', 'https://vodenje-konference-frontend.onrender.com'];
app.use(cors({
  credentials: true,
  origin: function(origin, callback){
    // Allow requests with no origin (mobile apps, curl)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin)===-1){
      var msg = "The CORS policy does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.use(middleware.decodeToken)
app.use(express.json());

// parse application/json
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true }));

const db = require("./config/connection");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

  require("./routes/GradivoRoutes")(app);
  require("./routes/KonferencaRoutes")(app);
  require("./routes/OrganizatorRoutes")(app);
  require("./routes/ProstorRoutes")(app);
  require("./routes/UdelezenecRoutes")(app);
  require("./routes/MailRoutes")(app);

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
  app.get("/", (req, res) => {
    res.json({ message: "Začetna stran sfasfa" });
  });
  
  