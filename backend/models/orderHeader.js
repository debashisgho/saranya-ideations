var mongoose = require('mongoose');

var orderHeaderSchema = mongoose.Schema({

	customer:{ type : mongoose.Schema.Types.ObjectId, ref: 'User', required:true},	
	orderItems:[{type:mongoose.Schema.Types.ObjectId, ref:'OrderItem',required:false}],
   shipToAddress:{	type:mongoose.Schema.Types.ObjectId, ref:'Address',required:false},
   shippingNotRequired:{type:Boolean, required:true, default:true},
   shipmentCharge:{type:Number, requird:true},
   orderStatus:{type:String, required:true, enum: ['New', 'Fulfillment in progress','Dispatched','Complete','Cancelled'], default: 'New', trim:true},
   additionalNotes:{type:String, required:false},
   create_date:{
		type:Date, default: Date.now
	}   

},{collection: 'orderHeaders'});

//create a unique index based on customer
orderHeaderSchema.index({customer:1,orderStatus:1});
orderHeaderSchema.index({orderStatus:1});

var OrderHeader = mongoose.model('OrderHeader',orderHeaderSchema);


