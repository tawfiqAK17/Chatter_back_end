import message_model from "../../models/message.js"
export const creatMessage = async (content, sender_id, receiver_id, time) => {
    return message_model.create({
        content: content,
        sender: sender_id,
        receiver: receiver_id,
        time: time 
    });
}
