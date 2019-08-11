const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    title:{
        type:String,
        unique:true,
        required: true,
        trim: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

ChatSchema.virtual('message', {
    ref: 'Message',
    localField: '_id',
    foreignField: 'messageId'
});

const Chat = mongoose.model('Chat', ChatSchema);

module.exports = Chat;