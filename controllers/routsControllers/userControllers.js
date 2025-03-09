import message_model from '../../models/message.js';
import user_model from '../../models/user.js';
import socketStore from '../socketStore.js';

export const get_users = async (req, res) => {
    try {
        const user_id = req.body.user.id;
        const users = await user_model.find({_id: { $ne : user_id}});
        if (users.length === 0) {
            return res.status(200).json({users});
        }
        const usersWithMessages = await Promise.all(users.map(async (user) => {
            const [last_msg] = await message_model.find({
                $or: [
                    { sender: user_id, receiver: user._id },
                    { sender: user._id, receiver: user_id }
                ]
            }).sort({ time: -1 }).limit(1);
            return {
                ...user.toObject(),
                last_msg: last_msg?.content || null,
                last_msg_time: last_msg?.time || null,
                online: socketStore.isConnected(user._id.toString())
            };
        }));
        res.status(200).json({users: usersWithMessages});
    } catch (err){
        console.log(err);
        res.status(500);
    }
}

export const get_user = async (req, res) => {
    try {
        const user_id = req.body.user.id;
        const user = await user_model.findById(user_id);
        if (user) {
            return res.status(200).json({user});
        } else {
            res.status(401).json({});
        }
    } catch (err) {
        res.status(500).json({});
        console.log(err);
    }

}
