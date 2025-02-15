import mongoose from "mongoose";

//defining the message schema
const message_schema = mongoose.Schema({
    sender: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    receiver: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    time: Date,
    content: String,
    readed: Boolean
});

//creating the message model
const message_model = mongoose.model('message', message_schema);

export default message_model;

