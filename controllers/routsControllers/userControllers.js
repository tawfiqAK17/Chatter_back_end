import user_model from '../../models/user.js';
import jsonwebtoken from 'jsonwebtoken';

export const get_users = async (req, res) => {
    try {
        const user_id = jsonwebtoken.decode(req.cookies.jwt).id;
        const users = await user_model.find({_id: { $ne : user_id}});
        res.status(200).json({users: users});
    } catch {
        res.status(500)
    }
}
