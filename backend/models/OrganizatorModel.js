var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var OrganizatorSchema = new Schema({
	'username' : String,
	'password' : String,
	'ime' : String,
	'priimek' : String,
	'token':String
},{
	collection: 'Organizator' // Specify the collection name here without the "s"
  });
  

module.exports = mongoose.model('Organizator', OrganizatorSchema);
