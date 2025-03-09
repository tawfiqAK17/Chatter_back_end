import bcrypt from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken';
import { configDotenv } from 'dotenv';
import user_model from '../../models/user.js';
import { creatUser } from '../modelsControllers/userModelControllers.js';


configDotenv();
// the secret string to sign a jwt
const jwt_secret = process.env.JWT_SECRET_STRING;

// generate a jwt based on the user id
function gen_jwt(id) {
    return jsonwebtoken.sign({ id }, jwt_secret);
}

export const signInController = async (req, res) => {
    try {
        const { email, password } = req.body;
        // locking for the user
        const user = await user_model.findOne({email: email});
        if (user) {
            // check if the password sha match
            const match = await bcrypt.compare(password, user.password_SHA);
            
            // is the user has an account the auth token will be send
            if (match) {
                return res.status(200).json({ jwt: gen_jwt(user._id)});
            }
        }
        // the user has no account
        res.status(401).json({}); 

    } catch (error) {
        res.status(500).json({});
        console.log(error);
    }
}

export const signUpController = async (req, res) => {
    try {
        const new_user = req.body;
        // duplicate email are not allowed
        if(await user_model.findOne({email: new_user.email})) {
            return res.status(401).json({});
        }
        // adding the new user
        await creatUser(new_user);
        // sending the auth token
        res.status(201).json({ jwt: gen_jwt(user._id) });
    } catch (error) {
        res.status(500).json({});
        console.log(error);
    }
}
