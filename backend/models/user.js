
/*sample JSON

{
	"name": {
      "first":"Debashis",
      "last": "Ghosh"
  	},
	
	"email":"debashisgho@gmail.com",

	"phone":
		{
			"primary":"9903887868",
			"alternate1":"8583018301",
			"alternate2":"8585085845",
			"alternate3":"99999999"
					          
		},

	"hashed_pwd":"welcome1"	
}*/

var mongoose = require('mongoose');


//user schema
var userSchema = mongoose.Schema({

	name: {
      first: { type: String, required: true, trim: true},
      last: { type: String, required: true, trim: true}
  	},
	
	email:{
		type: String, required : true, unique: true, trim:true
	},

	phone:
		{
			primary:{type: String, trim:true},
			alternate1:{type: String, trim:true},
			alternate2:{type: String, trim:true},
			alternate3:{type: String, trim:true}
		},

	hashed_pwd:{type:String, required:true, default:'passw0rd'},

	temp_pwd:{type: String},

	temp_pwd_time:{type: Date},

	create_date:{
		type:Date, default: Date.now
	}

},{collection: 'users'});

userSchema.pre('validate', function (next) {
  console.log('pre validate method----');
  if(this.hashed_pwd == 'undefined'){
  	// next(new Error('hashed_pwd should not be empty'));  	
    return;
  }
  next();
});

var User = mongoose.model('User',userSchema);

//Get All Users - should be restricted 
getUsers = function(callback,limit){
	var searchOptions='';
	var selectionRange = {hashed_pwd:0,hashed_pwd_time:0,temp_pwd:0,temp_pwd_time:0,create_date:0,__v:0};
	User.find(searchOptions,selectionRange,callback).limit(limit);
}


//Get User by Email

getUserByEmail = function(emailId,callback){
	console.log('user.js - get user by email -email id:'+emailId);
	var searchOptions = {"email":emailId};
	//var selectionRange = {hashed_pwd:0,hashed_pwd_time:0,temp_pwd:0,temp_pwd_time:0,create_date:0,__v:0};
	var selectionRange = {__v:0};
	//console.log(searchOptions);
	User.find(searchOptions, selectionRange,callback);
}


//Get user by id

getUserById = function(_id, callback){
	console.log('user.js - get user by id -id'+_id);
	var searchOptions = {"_id":_id};
	var selectionRange = {__v:0};
	User.find(searchOptions, selectionRange,callback);
}

// Get users by name with partial match

getUsersByName = function(name, callback){

	var nameRegEx = new RegExp(name, 'i');

	console.log('user.js - get user by name  -name:'+name);
	
	var searchOptions = {$or:[{"name.first":nameRegEx},{"name.last":nameRegEx}]};
	var selectionRange = {hashed_pwd:0,hashed_pwd_time:0,temp_pwd:0,temp_pwd_time:0,create_date:0,__v:0};
	User.find(searchOptions, selectionRange,callback);

}

//Add User
addUser = function(user, callback){
	console.log(user);
	User.create(user, callback);
}


//Update User (basic information - not password)

updateUser = function(emailId, user,callback){
	var searchOptions = {"email":emailId};

	User.findOneAndUpdate(searchOptions, user, callback);
}

/*
//delete Book
deleteBook = function(id, callback){
	var query = {"_id":id};
	Book.remove(query,callback);
}

*/





User.getUsers = getUsers;
User.getUserByEmail = getUserByEmail;
User.getUserById = getUserById;
User.getUsersByName = getUsersByName
User.addUser = addUser;
User.updateUser = updateUser;

module.exports = User ;