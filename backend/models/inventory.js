var mongoose = require('mongoose');

var inventorySchema = mongoose.Schema({

	product:
		{ type : mongoose.Schema.Types.ObjectId, ref: 'Product', required:true},
	inStock:
		{type: Number, required:true},
	ordered:
		{type: Number, required:true},
	fulfilled:
		{type: Number, required:true},
	
   create_date:{
		type:Date, default: Date.now
	}

},{collection: 'inventories'});

//create a unique index based on productId
inventorySchema.index({product:1});


var Inventory = mongoose.model('Inventory',inventorySchema);

