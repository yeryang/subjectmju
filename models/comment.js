 var mongoose 	=	 require('mongoose'),
    mongoosePaginate = require('mongoose-paginate');

mongoose.connect('mongodb://yeryang:mjuexpress123@ds129454.mlab.com:29454/mju_express');

var commentSchema 	=  mongoose.Schema({ 
	
	author: 
	{ 
		type:  mongoose.Schema.Types.ObjectId, 
		ref: 'User' 
	},
	targetProject: 
	{ 
		type:  mongoose.Schema.Types.ObjectId, 
		ref: 'Project' 
	},
	content: 
	{
		type: String, 
		trim: true, 
		required: true
	},
	numLikes: 
	{
		type: Number, 
		default: 0
	},
	createdAt: {
		type: Date, 
		default: Date.now
	}
	 
});

commentSchema.plugin(mongoosePaginate);
module.exports =  mongoose.model('Comment', commentSchema);
