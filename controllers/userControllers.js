import user_model from '../models/user.js';

export const get_users = async (req, res) => {
    try {
        const users = await user_model.find();
        res.status(200).json({users: users});
    } catch {
        res.status(500)
    }
}
