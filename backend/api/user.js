var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');

User = require('../models/user');


function removeSensitiveData(user){
	var userJSObj = user[0].toObject();
	delete userJSObj.hashed_pwd;
	delete userJSObj.temp_pwd;
	delete userJSObj.temp_pwd_time;
	var userJSObjArr =[{}];
	userJSObjArr[0]=userJSObj;
	return userJSObjArr;
}

//get users
router.get('/saranya-ideations/api/users',function(request, response){
	User.getUsers(function(err,users){
		if(err){
			response.json(err);
			return;
		}
		response.json(users);
	});
});

//get user by email
router.get('/saranya-ideations/api/user/:_emailId',function(request, response){
	console.log('get user by email called for email id:'+request.params._emailId);

	if(request.params._emailId =='currentUser'){
		console.log('get profile for current User');
		request.params._emailId = request.session.user.email;
	}

	console.log(request.params._emailId);
	
	User.getUserByEmail(request.params._emailId,function(err,user){

		if(err){
			console.log("app.js -getUserByEmail encountered error");
			response.json(err);
			return;
		}
		console.log("app.js -getUserByEmail db call success");
		
		response.json(removeSensitiveData(user));
	});
	
});



//get users by name with partial match

router.get('/saranya-ideations/api/users/name/:_name',function(request, response){
	console.log('get user by name called for name:'+request.params._name);

	
	User.getUsersByName(request.params._name,function(err,users){

		if(err){
			console.log("app.js -getUsersByName encountered error");
			response.json(err);
			return;
		}
		console.log("app.js -getUserByName db call success");
		console.log(users);
		
		//response.json(removeSensitiveData(users));
		response.json(users);
	});
	
});
//insert user
router.post('/saranya-ideations/api/user',function(request, response){
	console.log('insert user called');
	var user = request.body;	
	console.log("print user objects");
	var salt = bcrypt.genSaltSync(10);
	var hashed_pwd= bcrypt.hashSync(user.password, salt);
	user.hashed_pwd = hashed_pwd;
	delete user.password;
	delete user.passwordConfirm;

	console.log(user);
	User.addUser(user, function(err,user){
		delete user.hashed_pwd;
		if(err){			
			//throw err;
			if(err.code==11000){
				response.json({status:409,message:"User is already registered"});				
			}
			else{
				//response.json({status:500,message:"Internal Server Error"});
				response.json(err);
			}
			return;
		}
		response.json({status:201, message:"User successfully registered"});
	});
});


//update user
router.put('/saranya-ideations/api/user/:_emailId',function(request, response){
	var user = request.body;


	if(request.params._emailId =='currentUser'){
		console.log('update profile for current User');
		request.params._emailId = request.session.user.email;
	}
	//create a userMod so that only selective field can be updated
	var userMod={};
	userMod.name = user.name;
	userMod.phone = user.phone;
	if(user.password){
		var salt = bcrypt.genSaltSync(10);
		var hashed_pwd= bcrypt.hashSync(user.password, salt);
		userMod.hashed_pwd = hashed_pwd;
	}

	console.log("app.js - update user request for email id:"+request.params._emailId);
	
	User.updateUser(request.params._emailId, userMod, function(err){

		if(err){
			response.json(err);
			return;
		}
		
		//returned user document from update query can not sent back in the reseponse as it has credentials field
		/*User.getUserByEmail(request.params._emailId,function(err,user){
				if(err){
					response.json(err);
					return;
				}
				response.json(user);
   			});*/

   		response.json({status:202, message:"User successfully updated"});
	});
});



//login method User

router.post('/saranya-ideations/api/user/login',function(request, response){
	console.log('login user called');
	//console.log(request);
	var inUser = request.body;	
	//console.log(inUser);
	//console.log("print user objects");
	//console.log(inUser);
	//response.json(user);

	User.getUserByEmail(inUser.email,function(err,user){
		console.log(user);

		if(user.length == 0){
			console.log("email or password is wrong");
			response.json({status:400,message:"Login failed - email or password is wrong"});	
		}
		if(user.length >1){
			console.log("Multiple users found with same email");
			response.json({status:401,message:"Login failed - Multiple users found with same email id - Please contact Site administrator"});
		}

		if(user.length ==1){
			console.log("User found with email");
		
			if(bcrypt.compareSync(inUser.password, user[0].hashed_pwd)){
				
				//store required data in session cookie
				var sessionUser={};
				sessionUser.name = user[0].name;
				sessionUser.email = user[0].email;
				
				request.session.user = sessionUser;
				//console.log(request.session);

				var path = require('path');
			
				response.redirect('/saranya-ideations/home');		
			}
			else{
			console.log("email or password is wrong");
			response.json({status:400,message:"Login failed - email or password is wrong"});
			}
		}
	});

});


//logout method User

router.get('/saranya-ideations/api/user/session/logout',function(request, response){
	console.log('logout user called');
	request.session.reset();
	response.redirect('/saranya-ideations');

});

//get authenticated user

router.get('/saranya-ideations/api/user/session/isLoggedIn',function(request, response){
	console.log('-----------get session called-------------');
	var userInfo ={};
	userInfo.user = request.session.user;
	response.json(userInfo);
	
});

module.exports = router;
