var mongoose = require('mongoose');

//user schema
var productSchema = mongoose.Schema({

	shortName:
        {type: String, required: true, trim: true},

  	longDesc:
		{type: String, required: true, trim: true},

	parentProduct:
		{ type : mongoose.Schema.Types.ObjectId, ref: 'Product', required:true},

	imagesURL:[{type:String,required:true,trime:true}], //images will be stored in https://pichub.site/

	price:{
		manufacturing:{type: Number, required:true, trim:true},
		targetSell:{type: Number, required:true, trim:true},
		discountPercentage:{type: Number, required:false, trim:true}
	},	

	isCategory:
	{type:Boolean, required:true, default:false},

	
   create_date:{
		type:Date, default: Date.now
	}

},{collection: 'products'});

//create a unique index based on shortName, parentProduct
productSchema.index({shortName:1, parentProduct:1},{unique: true});

/*productSchema.pre('validate', function (next) {
  if(this.shortName == null || this.longDesc == null){
  	// next(new Error('hashed_pwd should not be empty'));
  	console.log('Room data is not okay');  	
    return;
  }
  next();
});*/

var Product = mongoose.model('Product',productSchema);

