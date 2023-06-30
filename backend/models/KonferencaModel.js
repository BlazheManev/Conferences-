const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const KonferencaSchema = new Schema({
	naslov: String,
	datum: Date,
	zacetakUra: String,
	konecUra: String,
	timelines: [
	  {
		ime:String,
		zacetak: String,
		konec: String,
		gradiva: {
			id: String,
			naslov: String,
			avtor: String
		  }
	  }
	],
	Udelezenci: [
		{
		  email:String,
		}
	  ]
	  
	
  }, {
	collection: 'Konferenca'
  });
  

module.exports = mongoose.model('Konferenca', KonferencaSchema);
