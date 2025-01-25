import bcrypt from 'bcrypt'
import express, { Router } from 'express';
import mongoose from 'mongoose';

const sign_in_up_route = express.Router();

// define the user schema
const userSchema = new mongoose.Schema({
    name: String, 
    email: String,
    password_SHA: String
});
// create a model
const userModel = mongoose.model('user', userSchema);

// user authentication
sign_in_up_route.post('/sign-in', async (req, res) => {
    try {
        console.log("post request");
        const { name, password } = req.body;

        // looking for the user
        const user = await userModel.findOne({name: name});
        if (user && bcrypt.compare(password, user.password_SHA)) {
            console.log(`user: ${name} just loged in`)
            return res.send('authenticated');
        }
        res.status(400).send('authentication failed'); 
    } catch (error) {
        res.status(500).send();
        console.log(error);
    }
});

//adding new user
sign_in_up_route.post('/sign-up', async (req, res) => {
    try {
        console.log("post request");
        const new_user = req.body;
        // duplicate name are not allowed
        if(await userModel.countDocuments({name: new_user.name}) > 0) {
            return res.send('taken user name');
        }
        // adding the new user
        await userModel.create({
            name: new_user.name,
            email: new_user.email,
            // save the password hash
            password_SHA: await bcrypt.hash(new_user.password, await bcrypt.genSalt()),
        });
        res.status(201).send('user added')
        console.log(`user: ${new_user.name} has just been added`);
    } catch (error) {
        res.status(500).send();
        console.log(error);
    }
})

export default sign_in_up_route;
