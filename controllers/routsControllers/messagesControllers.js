import jsonwebtoken from 'jsonwebtoken';
import message_model from '../../models/message.js';
import user_model from '../../models/user.js';

export const getMessages = async (req, res) => {
    try {
        const user_id = req.body.user.id; 
        const receiver_id = req.body.receiverId;

        const messages = await message_model.find( {$or: [
                                                    { sender: user_id, receiver: receiver_id },
                                                    { sender: receiver_id, receiver: user_id }
                                                ]}).sort({ time: 1 });
        const receiver = await user_model.findById(receiver_id);

        res.status(200).json({ messages: messages, receiver: receiver });
    } catch (err) {
        res.status(500).json();
        console.log(err);
    }
}
