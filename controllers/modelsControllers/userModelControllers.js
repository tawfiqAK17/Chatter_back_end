import bcrypt from 'bcrypt'
import user_model from '../../models/user.js';

export const creatUser = async (new_user) => {
    return  await user_model.create({
        name: new_user.name,
        email: new_user.email,
        // save the password hash
        password_SHA: await bcrypt.hash(new_user.password, await bcrypt.genSalt()),
        friends: [],
        rooms: []
    });
}
