var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var ProstorSchema = new Schema({
	'naziv' : String,
	'sedezi' : Number,
	'dostopnost' : Boolean,
	'naslov' : String
},{
	collection: 'Prostor' // Specify the collection name here without the "s"
  });

module.exports = mongoose.model('Prostor', ProstorSchema);
