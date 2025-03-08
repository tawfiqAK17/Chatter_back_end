import mongoose from 'mongoose';

// define the user schema
const user_schema = new mongoose.Schema({
    name: String, 
    email: String,
    password_SHA: String,
    avatar: String,
    contacts: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
});
// create a model
const user_model = mongoose.model('user', user_schema);

export default user_model;
