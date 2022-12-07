import { Schema, model } from 'mongoose';


const chatRoomSchema = new Schema({
    name: String,
    messageID: Array,
    userID: Array
}, { timestamps })

const ChatRoom = model('ChatRoom', chatRoomSchema);
export default ChatRoom;