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
        const { name, password } = req.body;
        // locking for the user
        const user = await user_model.findOne({name: name});
        // check if the password sha match
        const match = await bcrypt.compare(password, user.password_SHA);
        
        // is the user has an account the auth token will be send
        if (user && match) {
            res.cookie('jwt', gen_jwt(user._id), { httpOnly: true });
            return res.status(200).json({ message: 'authenticated' });
        }
        // the user has no account
        res.status(401).json({ message: 'authentication failed' }); 

    } catch (error) {
        res.status(500).json({});
        console.log(error);
    }
}

export const signUpController = async (req, res) => {
    try {
        const new_user = req.body;
        // duplicate names are not allowed
        if(await user_model.findOne({name: new_user.name})) {
            return res.status(401).json({message: 'taken user name'});
        }
        // adding the new user
        const user = creatUser(new_user);
        // adding the authentication cookie 
        res.cookie('jwt', gen_jwt(user._id), { httpOnly: true });
        res.status(201).json({message: 'user added'});
    } catch (error) {
        res.status(500).json({});
        console.log(error);
    }
}
