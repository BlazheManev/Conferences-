var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var UdelezenecSchema = new Schema({
	'username' : String,
	'ime' : String,
	'priimek' : String,
	'gibalnaOvira' : Boolean
},{
	collection: 'Udelezenec' // Specify the collection name here without the "s"
  });

module.exports = mongoose.model('Udelezenec', UdelezenecSchema);
