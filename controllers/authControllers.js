import bcrypt from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken';
import { configDotenv } from 'dotenv';
import user_model from '../models/user.js';


configDotenv();
// the secret string to sign a jwt
const jwt_secret = process.env.JWT_SECRET_STRING;

// generate a jwt based on the user id
function gen_jwt(id) {
    return jsonwebtoken.sign({ id }, jwt_secret);
}

export const signInController = async (req, res) => {
    try {
        const { name, password } = req.body;
        // locking for the user
        const user = await user_model.findOne({name: name});
        const match = await bcrypt.compare(password, user.password_SHA);
        if (user && match) {
            res.cookie('jwt', gen_jwt(user._id), { httpOnly: true });
            return res.status(200).json({ message: 'authenticated' });
        }
        res.status(401).json({ message: 'authentication failed' }); 
    } catch (error) {
        res.status(500).json({});
        console.log(error);
    }
}

export const signUpController = async (req, res) => {
    try {
        const new_user = req.body;
        // duplicate name are not allowed
        if(await user_model.countDocuments({name: new_user.name}) > 0) {
            return res.status(401).json({message: 'taken user name'});
        }
        // adding the new user
        const user = await user_model.create({
            name: new_user.name,
            email: new_user.email,
            // save the password hash
            password_SHA: await bcrypt.hash(new_user.password, await bcrypt.genSalt()),
            friends: [],
            rooms: []
        });
        res.cookie('jwt', gen_jwt(user._id), { httpOnly: true });
        res.status(201).json({message: 'user added'});
        console.log(`user: ${new_user.name} has just been added`);
    } catch (error) {
        res.status(500).json({});
        console.log(error);
    }
}
