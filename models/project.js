 

var mongoose = require('mongoose'),
    mongoosePaginate = require('mongoose-paginate');

mongoose.connect('mongodb://yeryang:mjuexpress123@ds129454.mlab.com:29454/mju_express');

var ProjectSchema 	=  mongoose.Schema({ 
	author : { 
		type 	:  mongoose.Schema.Types.ObjectId,
		ref	    : 'User',
		required: true,
	},
	title : { //공모전 제목
		type 	: String,
		required: true, 
		trim	: true,
	},
	content : { // 공모전 내용
		type 	: String,
		required: true, 
		trim	: true,
	},
	category : { // 분야
		type 	: String,
		required: true, 
		trim	: true,
	},
	target : { //응시대상
		type 	: String,
		required: true, 
		trim	: true,
	},
	endDate : { // 접수기간
		type 	: String,
		required: true, 
		trim	: true,
	},
	manager : { // 공모전 담당자
		type 	: String,
		required: true, 
		trim	: true,
	},
	contact : { // 연락처
		type 	: String,
		required: true, 
		trim	: true,
	},
	published: {
		type : Number,
		default: 0,
	},
	numLikes: 
	{
		type: Number, 
		default: 0
	},
	numAnswers: 
	{
		type: Number, 
		default: 0
	},
	numReads: 
	{
		type: Number, 
		default: 0
	},
	createdAt: {
		type: Date, 
		default: Date.now
	}, 
	 
});

ProjectSchema.plugin(mongoosePaginate);
module.exports =  mongoose.model('Project', ProjectSchema);
