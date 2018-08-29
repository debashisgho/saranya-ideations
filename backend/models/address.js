var mongoose = require('mongoose');

var addressSchema = mongoose.Schema({

	customer:{ type : mongoose.Schema.Types.ObjectId, ref: 'User', required:true},
	
	shipToAddress:{
			addressLine1:{type:String, reuired:true},
			addressLine2:{type:String, reuired:true},
			addressLine3:{type:String, reuired:false},
			city:{type:String, reuired:true},
			State:{type:String, reuired:true},
			pinCode:{type:Number, reuired:true},
			email:{type:String, required:false},
			phone:{type:String, required:false},
			landmark:{type:String, reuired:true},
	},
	addressType:{type:String, required:true, enum: ['ShipTo'], default: 'New', trim:true},
    isDefault:{type:Boolean, required:true, default:true},
   create_date:{
		type:Date, default: Date.now
	}   

},{collection: 'addresses'});


//create a unique index based on customer
addressSchema.index({customer:1});

var Address = mongoose.model('Address',addressSchema);


