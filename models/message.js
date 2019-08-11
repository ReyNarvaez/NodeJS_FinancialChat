const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    text:{
        type:String,
        trim: true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    chatId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Chat'
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;