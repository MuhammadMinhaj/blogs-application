const { Schema,model } = require('mongoose');

const Comment = require('./Comment')
const postSchema = new Schema({
    title:{
        type:String,
        trim:true,
        required:true,
        maxlength:100
    },
    body:{
        type:String,
        maxlength:5000,
        required:true
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'User',
        requred:true
    },
    tags:{
        type:[String],
        required:true,

    },
    createAt:{
        type:Date,
        default:new Date()
    },
    thumbnail:String,
    readTime:String,
    
    likes:[{
        type:Schema.Types.ObjectId,
        ref:'User'
    }],
    dislikes:[{
        type:Schema.Types.ObjectId,
        ref:'User'
    }],
    comments:[
        {
            type:Schema.Types.ObjectId,
            // ref:'Comment.user'  ------------Previus Code
            ref:'Comment'
        }
    ]
},{
    timestamps:true
})

// For searching Configuration
postSchema.index({
    title:'text',
    body:'text',
    tags:'text'
},{
    // Important for
    weights:{
        title:5,
        tags:5,
        body:2
    }
})


const Post = model('Post',postSchema);
module.exports=Post