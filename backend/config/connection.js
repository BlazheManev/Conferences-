const dbConfig = require("../config/config");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.gradivo = require("../models/GradivoModel")(mongoose);
db.gradivo = require("../models/KonferencaModel")(mongoose);
db.gradivo = require("../models/OrganizatorModel")(mongoose);
db.gradivo = require("../models/ProstorModel")(mongoose);
db.gradivo = require("../models/UdelezenecModel")(mongoose);



module.exports = db;