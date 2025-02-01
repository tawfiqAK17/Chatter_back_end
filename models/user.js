import mongoose from 'mongoose';

// define the user schema
const user_schema = new mongoose.Schema({
    name: String, 
    email: String,
    password_SHA: String,
    friends: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
    rooms: [{type: mongoose.Schema.Types.ObjectId, ref: 'room'}],
});
// create a model
const user_model = mongoose.model('user', user_schema);

export default user_model;
