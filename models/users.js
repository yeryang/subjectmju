var mongoose 	=	 require('mongoose');

mongoose.connect('mongodb://yeryang:mjuexpress123@ds129454.mlab.com:29454/mju_express');

var UserSchema 	=  mongoose.Schema({ 
	name : {
		type 	: String,
		required: true,  
	},
	username : {
		type 	: String,
		required: true, 
		index	: true
	},
	password :	{
		type 	: String, 
		required: true, 
		bcrypt  : true
	},
	isAdmin : {
		type 	: Number,
		required: true,
	    default : 0,
	}, 
	createdAt: {
		type: Date, 
		default: Date.now
	},
	email 		: String,
	 
});

module.exports =  mongoose.model('User', UserSchema);
