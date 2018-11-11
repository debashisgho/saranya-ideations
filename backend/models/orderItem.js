var mongoose = require('mongoose');

var orderItemSchema = mongoose.Schema({

		orderId:{type : mongoose.Schema.Types.ObjectId, ref: 'OrderHeader', required:true},
		product:{ type : mongoose.Schema.Types.ObjectId, ref: 'Product', required:true},
		quantity:{type:Number, required:true},
		orderPrice:{type:Number, required:true},
		create_date:{type:Date, default: Date.now}
	},{collection: 'orderItems'});

orderItemSchema.index({orderId:1});
orderItemSchema.index({product:1});

var OrderItem = mongoose.model('OrderItem',orderItemSchema);


