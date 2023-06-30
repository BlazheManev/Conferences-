var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var GradivoSchema = new Schema({
	'naslov' : String,
	'avtor' : String,
	'jePrispevek' : Boolean,
	'file' : String
},{
	collection: 'Gradivo' // Specify the collection name here without the "s"
  });
  

module.exports = mongoose.model('Gradivo', GradivoSchema);
